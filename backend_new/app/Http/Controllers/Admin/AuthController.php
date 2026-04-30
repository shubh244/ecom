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
            'username' => 'nullable|string',
            'email' => 'nullable|string',
            'password' => 'required',
        ]);

        // Simple admin authentication (you can use Laravel Sanctum later)
        $adminUsername = env('ADMIN_USERNAME', 'admin');
        $adminPassword = env('ADMIN_PASSWORD', '!Admin@123');
        $providedUsername = (string) ($request->input('username') ?? $request->input('email') ?? '');

        if ($providedUsername === $adminUsername && $request->password === $adminPassword) {
            // In production, use Laravel Sanctum or Passport
            $token = 'admin_token_' . time();
            
            return response()->json([
                'success' => true,
                'message' => 'Login successful',
                'token' => $token,
                'user' => [
                    'email' => $adminUsername,
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
