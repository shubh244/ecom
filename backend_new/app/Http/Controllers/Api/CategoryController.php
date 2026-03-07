<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Category;
use Illuminate\Http\JsonResponse;

class CategoryController extends Controller
{
    /**
     * Get all categories
     */
    public function index(): JsonResponse
    {
        $categories = Category::with('subcategories')->get();
        
        return response()->json([
            'success' => true,
            'data' => $categories
        ]);
    }

    /**
     * Get single category
     */
    public function show($id): JsonResponse
    {
        $category = Category::with('subcategories')->findOrFail($id);
        
        return response()->json([
            'success' => true,
            'data' => $category
        ]);
    }

    /**
     * Get products for a category
     */
    public function getProducts($id): JsonResponse
    {
        $category = Category::findOrFail($id);
        $products = $category->products()->with('category')->get();
        
        return response()->json([
            'success' => true,
            'data' => $products
        ]);
    }
}

