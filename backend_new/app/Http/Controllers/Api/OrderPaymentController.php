<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Models\OrderPayment;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class OrderPaymentController extends Controller
{
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
}
