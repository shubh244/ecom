<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class ProductController extends Controller
{
    /**
     * Get all products
     */
    public function index(Request $request): JsonResponse
    {
        $query = Product::with('category');
        
        // Filter by category
        if ($request->has('category')) {
            $query->where('category_id', $request->category);
        }
        
        // Filter by subcategory
        if ($request->has('subcategory')) {
            $query->where('subcategory', $request->subcategory);
        }
        
        // Search
        if ($request->has('search')) {
            $query->where('name', 'like', '%' . $request->search . '%');
        }
        
        // Sort
        $sortBy = $request->get('sort_by', 'created_at');
        $sortOrder = $request->get('sort_order', 'desc');
        $query->orderBy($sortBy, $sortOrder);
        
        $products = $query->paginate($request->get('per_page', 20));
        
        return response()->json([
            'success' => true,
            'data' => $products
        ]);
    }

    /**
     * Get single product
     */
    public function show($id): JsonResponse
    {
        $product = Product::with('category')->findOrFail($id);
        
        return response()->json([
            'success' => true,
            'data' => $product
        ]);
    }

    /**
     * Get products by category
     */
    public function getByCategory($category): JsonResponse
    {
        $products = Product::whereHas('category', function($query) use ($category) {
            $query->where('slug', $category);
        })->with('category')->get();
        
        return response()->json([
            'success' => true,
            'data' => $products
        ]);
    }

    /**
     * Get featured products
     */
    public function getFeatured(): JsonResponse
    {
        $products = Product::where('is_featured', true)
            ->with('category')
            ->limit(8)
            ->get();
        
        return response()->json([
            'success' => true,
            'data' => $products
        ]);
    }

    /**
     * Create product (admin)
     */
    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'price' => 'required|numeric|min:0',
            'original_price' => 'nullable|numeric|min:0',
            'category_id' => 'required|exists:categories,id',
            'subcategory' => 'nullable|string',
            'description' => 'nullable|string',
            'image' => 'nullable|string',
            'rating' => 'nullable|numeric|min:0|max:5',
            'in_stock' => 'boolean',
            'is_featured' => 'boolean',
        ]);

        $product = Product::create($validated);
        
        return response()->json([
            'success' => true,
            'data' => $product
        ], 201);
    }

    /**
     * Update product (admin)
     */
    public function update(Request $request, $id): JsonResponse
    {
        $product = Product::findOrFail($id);
        
        $validated = $request->validate([
            'name' => 'sometimes|string|max:255',
            'price' => 'sometimes|numeric|min:0',
            'original_price' => 'nullable|numeric|min:0',
            'category_id' => 'sometimes|exists:categories,id',
            'subcategory' => 'nullable|string',
            'description' => 'nullable|string',
            'image' => 'nullable|string',
            'rating' => 'nullable|numeric|min:0|max:5',
            'in_stock' => 'boolean',
            'is_featured' => 'boolean',
        ]);

        $product->update($validated);
        
        return response()->json([
            'success' => true,
            'data' => $product
        ]);
    }

    /**
     * Delete product (admin)
     */
    public function destroy($id): JsonResponse
    {
        $product = Product::findOrFail($id);
        $product->delete();
        
        return response()->json([
            'success' => true,
            'message' => 'Product deleted successfully'
        ]);
    }
}

