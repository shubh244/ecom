<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Models\OrderPayment;
use App\Models\OrderPaymentScreenshot;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Razorpay\Api\Api;
use Razorpay\Api\Errors\Error as RazorpayError;

class OrderPaymentController extends Controller
{
    /**
     * Create a Razorpay order for Checkout (same flow as standard Razorpay web integration).
     */
    public function createRazorpayOrder(Request $request, int $orderId): JsonResponse
    {
        if (! config('payment.razorpay_enabled')) {
            return response()->json([
                'success' => false,
                'message' => 'Razorpay is not configured. Set RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET.',
            ], 503);
        }

        $order = Order::findOrFail($orderId);

        $payment = OrderPayment::query()
            ->where('order_id', $order->id)
            ->where('method', 'razorpay')
            ->where('status', 'pending')
            ->orderByDesc('id')
            ->first();

        if (! $payment) {
            return response()->json([
                'success' => false,
                'message' => 'No pending Razorpay payment for this order.',
            ], 422);
        }

        try {
            $api = new Api(
                (string) config('payment.razorpay_key_id'),
                (string) config('payment.razorpay_key_secret')
            );

            $amountPaise = (int) round((float) $order->total_amount * 100);

            $razorpayOrder = $api->order->create([
                'receipt' => (string) $order->order_number,
                'amount' => $amountPaise,
                'currency' => 'INR',
                'payment_capture' => 1,
                'notes' => [
                    'order_id' => (string) $order->id,
                    'order_number' => $order->order_number,
                ],
            ]);

            $payment->update([
                'razorpay_order_id' => $razorpayOrder['id'],
            ]);

            return response()->json([
                'success' => true,
                'data' => [
                    'key_id' => config('payment.razorpay_key_id'),
                    'amount' => $amountPaise,
                    'currency' => 'INR',
                    'order_id' => $razorpayOrder['id'],
                    'order_number' => $order->order_number,
                    'prefill' => [
                        'name' => $order->customer_name,
                        'email' => $order->customer_email,
                        'contact' => $order->customer_phone ?? '',
                    ],
                ],
            ]);
        } catch (RazorpayError $e) {
            return response()->json([
                'success' => false,
                'message' => $e->getMessage(),
            ], 502);
        } catch (\Throwable $e) {
            report($e);

            return response()->json([
                'success' => false,
                'message' => 'Could not create Razorpay order.',
            ], 502);
        }
    }

    /**
     * Verify Razorpay payment signature and mark order paid (processing).
     */
    public function verifyRazorpayPayment(Request $request, int $orderId): JsonResponse
    {
        if (! config('payment.razorpay_enabled')) {
            return response()->json([
                'success' => false,
                'message' => 'Razorpay is not configured.',
            ], 503);
        }

        $validated = $request->validate([
            'razorpay_order_id' => 'required|string|max:64',
            'razorpay_payment_id' => 'required|string|max:64',
            'razorpay_signature' => 'required|string|max:255',
        ]);

        $secret = (string) config('payment.razorpay_key_secret');
        $payload = $validated['razorpay_order_id'].'|'.$validated['razorpay_payment_id'];
        $expected = hash_hmac('sha256', $payload, $secret);

        if (! hash_equals($expected, $validated['razorpay_signature'])) {
            return response()->json([
                'success' => false,
                'message' => 'Invalid payment signature.',
            ], 400);
        }

        $order = Order::findOrFail($orderId);

        $payment = OrderPayment::query()
            ->where('order_id', $order->id)
            ->where('razorpay_order_id', $validated['razorpay_order_id'])
            ->first();

        if (! $payment) {
            return response()->json([
                'success' => false,
                'message' => 'Payment record not found for this Razorpay order.',
            ], 404);
        }

        if ($payment->status === 'success') {
            return response()->json([
                'success' => true,
                'message' => 'Payment already verified.',
                'data' => $payment,
            ]);
        }

        $payment->update([
            'status' => 'success',
            'razorpay_payment_id' => $validated['razorpay_payment_id'],
        ]);

        $order->update(['status' => 'processing']);

        return response()->json([
            'success' => true,
            'message' => 'Payment verified.',
            'data' => $payment->fresh(),
        ]);
    }

    /**
     * Record a payment outcome after the customer completes or fails UPI in their app.
     * Each call appends a row for audit (success/failed). Initial "pending" row is created with the order.
     */
    public function report(Request $request, int $orderId): JsonResponse
    {
        $order = Order::findOrFail($orderId);

        $validated = $request->validate([
            'status' => 'required|in:success,failed',
            'utr' => 'nullable|string|max:255',
            'note' => 'nullable|string|max:500',
        ]);

        $payment = OrderPayment::create([
            'order_id' => $order->id,
            'status' => $validated['status'],
            'amount' => $order->total_amount,
            'method' => 'upi',
            'currency' => 'INR',
            'utr_reference' => $validated['utr'] ?? null,
            'note' => $validated['note'] ?? null,
        ]);

        return response()->json([
            'success' => true,
            'message' => $validated['status'] === 'success'
                ? 'Payment recorded as successful.'
                : 'Payment recorded as failed.',
            'data' => $payment,
        ]);
    }

    /**
     * Store a payment confirmation screenshot for an order (guest checkout, no auth).
     */
    public function uploadScreenshot(Request $request, int $orderId): JsonResponse
    {
        $order = Order::findOrFail($orderId);

        $validated = $request->validate([
            'screenshot' => 'required|file|image|mimes:jpeg,png,jpg,gif,webp|max:10240',
        ]);

        $path = $request->file('screenshot')->store(
            'payment-proofs/'.$order->id,
            'public'
        );

        $shot = OrderPaymentScreenshot::create([
            'order_id' => $order->id,
            'path' => $path,
            'disk' => 'public',
            'original_name' => $request->file('screenshot')->getClientOriginalName(),
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Screenshot uploaded.',
            'data' => $shot->fresh(),
        ], 201);
    }
}
