<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Session;

class CartController extends Controller
{
    /**
     * Add item to cart
     */
    public function add(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'product_id' => 'required|exists:products,id',
            'quantity' => 'required|integer|min:1',
        ]);

        $cart = Session::get('cart', []);
        $productId = $validated['product_id'];
        
        if (isset($cart[$productId])) {
            $cart[$productId]['quantity'] += $validated['quantity'];
        } else {
            $cart[$productId] = [
                'product_id' => $productId,
                'quantity' => $validated['quantity'],
            ];
        }
        
        Session::put('cart', $cart);
        
        return response()->json([
            'success' => true,
            'message' => 'Item added to cart',
            'data' => $cart
        ]);
    }

    /**
     * Get cart items
     */
    public function index(): JsonResponse
    {
        $cart = Session::get('cart', []);
        $items = [];
        
        foreach ($cart as $productId => $item) {
            $product = \App\Models\Product::with('category')->find($productId);
            if ($product) {
                $items[] = [
                    'product' => $product,
                    'quantity' => $item['quantity'],
                ];
            }
        }
        
        return response()->json([
            'success' => true,
            'data' => $items
        ]);
    }

    /**
     * Remove item from cart
     */
    public function remove($id): JsonResponse
    {
        $cart = Session::get('cart', []);
        unset($cart[$id]);
        Session::put('cart', $cart);
        
        return response()->json([
            'success' => true,
            'message' => 'Item removed from cart'
        ]);
    }

    /**
     * Update cart item quantity
     */
    public function update(Request $request, $id): JsonResponse
    {
        $validated = $request->validate([
            'quantity' => 'required|integer|min:1',
        ]);

        $cart = Session::get('cart', []);
        if (isset($cart[$id])) {
            $cart[$id]['quantity'] = $validated['quantity'];
            Session::put('cart', $cart);
        }
        
        return response()->json([
            'success' => true,
            'message' => 'Cart updated'
        ]);
    }

    /**
     * Clear cart
     */
    public function clear(): JsonResponse
    {
        Session::forget('cart');
        
        return response()->json([
            'success' => true,
            'message' => 'Cart cleared'
        ]);
    }
}

