<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateTServiceBillingTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('t_service_billing', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->string('hash_id', 16)
                ->nullable(true);
            $table->unsignedBigInteger('buyer_id');
            $table->string('buyer_type');
            $table->unsignedBigInteger('m_shop_id');
            $table->string('stripe_payment_id');
            $table->decimal('price', 10, 2);
            $table->tinyInteger('payment_method')->default(1);
            $table->tinyInteger('status')->default(0);
            $table->text('log')->nullable();
            $table->tinyInteger('type')->default(0);
            $table->dateTime('pay_expired_at')->nullable();
            $table->unsignedInteger('total_qr_number')
                ->default(0)
                ->comment('Monthly total QR numbers');
            $table->unsignedInteger('extend_qr_number')
                ->default(0)
                ->comment('Monthly extented QR numbers');
            $table->date('start_date');
            $table->date('end_date');
            $table->date('target_month');
            $table->string('stripe_hosted_invoice_url')->nullable();
            $table->string('stripe_invoice_pdf')->nullable();
            $table->timestamps();

            $table->foreign('m_shop_id')->references('id')->on('m_shop');
            $table->index(['buyer_id', 'buyer_type', 'm_shop_id', 'stripe_payment_id'], 'stripe_payment_unique');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('t_service_billing');
    }
}
