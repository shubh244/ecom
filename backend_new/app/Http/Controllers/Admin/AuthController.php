<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;

class AuthController extends Controller
{
    /**
     * Admin login
     */
    public function login(Request $request): JsonResponse
    {
        $request->validate([
            'email' => 'required|email',
            'password' => 'required',
        ]);

        // Simple admin authentication (you can use Laravel Sanctum later)
        $adminEmail = env('ADMIN_EMAIL', 'admin@woodstate.com');
        $adminPassword = env('ADMIN_PASSWORD', 'admin123');

        if ($request->email === $adminEmail && $request->password === $adminPassword) {
            // In production, use Laravel Sanctum or Passport
            $token = 'admin_token_' . time();
            
            return response()->json([
                'success' => true,
                'message' => 'Login successful',
                'token' => $token,
                'user' => [
                    'email' => $adminEmail,
                    'name' => 'Admin',
                ]
            ]);
        }

        throw ValidationException::withMessages([
            'email' => ['The provided credentials are incorrect.'],
        ]);
    }

    /**
     * Admin logout
     */
    public function logout(Request $request): JsonResponse
    {
        return response()->json([
            'success' => true,
            'message' => 'Logged out successfully'
        ]);
    }
}
