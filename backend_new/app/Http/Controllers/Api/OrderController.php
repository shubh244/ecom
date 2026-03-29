<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\OrderPayment;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class OrderController extends Controller
{
    /**
     * Create a new order
     */
    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'customer_name' => 'required|string|max:255',
            'customer_email' => 'required|email',
            'customer_phone' => 'nullable|string',
            'shipping_address' => 'required|string',
            'items' => 'required|array|min:1',
            'items.*.product_id' => 'required|exists:products,id',
            'items.*.quantity' => 'required|integer|min:1',
            'notes' => 'nullable|string',
        ]);

        // Calculate totals
        $subtotal = 0;
        $items = [];

        foreach ($validated['items'] as $itemData) {
            $product = \App\Models\Product::find($itemData['product_id']);
            $itemSubtotal = $product->price * $itemData['quantity'];
            $subtotal += $itemSubtotal;

            $items[] = [
                'product' => $product,
                'quantity' => $itemData['quantity'],
                'price' => $product->price,
                'subtotal' => $itemSubtotal,
            ];
        }

        $tax = $subtotal * 0.18; // 18% GST
        $shippingCost = $subtotal > 20000 ? 0 : 500; // Free shipping over ₹20,000
        $totalAmount = $subtotal + $tax + $shippingCost;

        // Create order
        $order = Order::create([
            'order_number' => 'WS-' . strtoupper(uniqid()),
            'customer_name' => $validated['customer_name'],
            'customer_email' => $validated['customer_email'],
            'customer_phone' => $validated['customer_phone'] ?? null,
            'shipping_address' => $validated['shipping_address'],
            'status' => 'pending',
            'total_amount' => $totalAmount,
            'subtotal' => $subtotal,
            'tax' => $tax,
            'shipping_cost' => $shippingCost,
            'notes' => $validated['notes'] ?? null,
        ]);

        // Create order items
        foreach ($items as $item) {
            OrderItem::create([
                'order_id' => $order->id,
                'product_id' => $item['product']->id,
                'product_name' => $item['product']->name,
                'price' => $item['price'],
                'quantity' => $item['quantity'],
                'subtotal' => $item['subtotal'],
            ]);
        }

        $upiVpa = (string) config('payment.upi_vpa');
        $upiName = (string) config('payment.upi_merchant_name');
        $amt = number_format((float) $totalAmount, 2, '.', '');
        $tn = rawurlencode('Order '.$order->order_number);
        $upiUrl = 'upi://pay?pa='.rawurlencode($upiVpa)
            .'&pn='.rawurlencode($upiName)
            .'&am='.$amt
            .'&cu=INR'
            .'&tn='.$tn;

        $payment = OrderPayment::create([
            'order_id' => $order->id,
            'status' => 'pending',
            'amount' => $totalAmount,
            'method' => 'upi',
            'currency' => 'INR',
            'upi_pay_url' => $upiUrl,
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Order created successfully',
            'data' => [
                'order' => $order->load('items.product'),
                'payment' => $payment,
                'upi_pay_url' => $upiUrl,
                'merchant_upi_vpa' => $upiVpa,
            ],
        ], 201);
    }

    /**
     * Get all orders
     */
    public function index(Request $request): JsonResponse
    {
        $orders = Order::with(['items.product', 'payments', 'paymentScreenshots'])
            ->orderBy('created_at', 'desc')
            ->paginate(20);

        return response()->json([
            'success' => true,
            'data' => $orders
        ]);
    }

    /**
     * Get single order
     */
    public function show($id): JsonResponse
    {
        $order = Order::with(['items.product', 'payments', 'paymentScreenshots'])->findOrFail($id);

        return response()->json([
            'success' => true,
            'data' => $order
        ]);
    }
}
