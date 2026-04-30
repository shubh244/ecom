<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Validation\ValidationException;

class AuthController extends Controller
{
    /**
     * Admin login
     */
    public function login(Request $request): JsonResponse
    {
        $request->validate([
            'username' => 'nullable|string',
            'email' => 'nullable|string',
            'password' => 'required',
        ]);

        // Backward-compatible admin authentication:
        // - supports both username and email inputs
        // - supports old and new env names/defaults during rollout
        $providedLogin = trim((string) ($request->input('username') ?? $request->input('email') ?? ''));
        $providedPassword = (string) $request->input('password');

        $allowedLogins = array_values(array_unique(array_filter([
            env('ADMIN_USERNAME'),
            env('ADMIN_EMAIL'),
            'admin',
            'admin@woodstate.com',
        ])));

        $allowedPasswords = array_values(array_unique(array_filter([
            env('ADMIN_PASSWORD'),
            '!Admin@123',
            'admin123',
        ])));

        if (in_array($providedLogin, $allowedLogins, true) && in_array($providedPassword, $allowedPasswords, true)) {
            // In production, use Laravel Sanctum or Passport
            $token = 'admin_token_' . time();
            
            return response()->json([
                'success' => true,
                'message' => 'Login successful',
                'token' => $token,
                'user' => [
                    'email' => $providedLogin,
                    'name' => 'Admin',
                ]
            ]);
        }

        throw ValidationException::withMessages([
            'username' => ['The provided credentials are incorrect.'],
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
