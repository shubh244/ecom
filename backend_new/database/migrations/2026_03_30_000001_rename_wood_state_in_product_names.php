<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    private const FROM = 'Wood State';

    private const TO = 'Shreejee Blessings Wood';

    public function up(): void
    {
        foreach (DB::table('products')->where('name', 'like', '%'.self::FROM.'%')->cursor() as $row) {
            DB::table('products')->where('id', $row->id)->update([
                'name' => str_replace(self::FROM, self::TO, $row->name),
            ]);
        }

        foreach (DB::table('order_items')->where('product_name', 'like', '%'.self::FROM.'%')->cursor() as $row) {
            DB::table('order_items')->where('id', $row->id)->update([
                'product_name' => str_replace(self::FROM, self::TO, $row->product_name),
            ]);
        }
    }

    public function down(): void
    {
        foreach (DB::table('products')->where('name', 'like', '%'.self::TO.'%')->cursor() as $row) {
            DB::table('products')->where('id', $row->id)->update([
                'name' => str_replace(self::TO, self::FROM, $row->name),
            ]);
        }

        foreach (DB::table('order_items')->where('product_name', 'like', '%'.self::TO.'%')->cursor() as $row) {
            DB::table('order_items')->where('id', $row->id)->update([
                'product_name' => str_replace(self::TO, self::FROM, $row->product_name),
            ]);
        }
    }
};
