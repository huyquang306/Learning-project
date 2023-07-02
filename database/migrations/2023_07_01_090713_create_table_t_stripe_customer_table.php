<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateTableTStripeCustomerTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('t_stripe_customer', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->unsignedBigInteger('m_user_id');
            $table->string('stripe_customer_id');
            $table->tinyInteger('payment_method')->nullable();
            $table->unsignedBigInteger('customer_id');
            $table->string('customer_type');
            $table->timestamps();
            $table->softDeletes();

            $table->index(['customer_id', 'customer_type', 'stripe_customer_id'], 't_stripe_customer_unique');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('t_stripe_customer');
    }
}
