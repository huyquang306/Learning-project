<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateTPaymentMethodTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('t_payment_method', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->unsignedBigInteger('t_payment_id')
                ->nullable(false);
            $table->unsignedBigInteger('m_payment_method_id')
                ->nullable(false);
            $table->unsignedInteger('value')->default(0);
            $table->timestamps();

            $table->foreign('t_payment_id')
                ->references('id')
                ->on('t_payment');
            $table->foreign('m_payment_method_id')
                ->references('id')
                ->on('m_payment_method');
            $table->index(['t_payment_id', 'm_payment_method_id']);
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('t_payment_method');
    }
}
