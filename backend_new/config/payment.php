<?php

$keyId = trim((string) (env('RAZORPAY_KEY_ID') ?: env('RAZORPAY_KEY') ?: ''));
$keySecret = trim((string) (env('RAZORPAY_KEY_SECRET') ?: env('RAZORPAY_SECRET') ?: ''));

return [
    'upi_vpa' => env('MERCHANT_UPI_VPA', 'merchant@upi'),
    'upi_merchant_name' => env('MERCHANT_UPI_NAME', 'Merchant'),

    'razorpay_key_id' => $keyId,
    'razorpay_key_secret' => $keySecret,
    'razorpay_enabled' => ! empty($keyId) && ! empty($keySecret),
];
