<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateTPaymentTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('t_payment', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->unsignedBigInteger('t_ordergroup_id')
                ->nullable(false);
            $table->unsignedInteger('subtotal_amount_value')
                ->default(0);
            $table->unsignedInteger('tax_value')
                ->default(0);
            $table->unsignedInteger('total_amount_value')
                ->default(0);
            $table->unsignedInteger('total_amount_received')
                ->default(0);
            $table->unsignedInteger('change_value')
                ->default(0);
            $table->timestamps();

            $table->foreign('t_ordergroup_id')
                ->references('id')
                ->on('t_ordergroup');
            $table->index(['t_ordergroup_id']);
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('t_payment');
    }
}
