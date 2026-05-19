<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;

class PaymentConfigController extends Controller
{
    /**
     * Public payment options for checkout (no secrets).
     */
    public function show(): JsonResponse
    {
        $razorpayEnabled = (bool) config('payment.razorpay_enabled');
        $keyId = config('payment.razorpay_key_id');

        return response()->json([
            'success' => true,
            'data' => [
                'razorpay_enabled' => $razorpayEnabled,
                'razorpay_key_id' => $razorpayEnabled ? (string) $keyId : null,
                'upi_vpa' => (string) config('payment.upi_vpa'),
                'upi_merchant_name' => (string) config('payment.upi_merchant_name'),
            ],
        ]);
    }
}
