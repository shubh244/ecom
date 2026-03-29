<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('order_payments', function (Blueprint $table) {
            $table->id();
            $table->foreignId('order_id')->constrained()->cascadeOnDelete();
            $table->string('status', 20);
            $table->string('method', 20)->default('upi');
            $table->decimal('amount', 12, 2);
            $table->string('currency', 3)->default('INR');
            $table->text('upi_pay_url')->nullable();
            $table->string('utr_reference', 255)->nullable();
            $table->string('note', 500)->nullable();
            $table->timestamps();

            $table->index(['order_id', 'created_at']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('order_payments');
    }
};
