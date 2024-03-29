<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateTServiceBillingDetailTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('t_service_billing_detail', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->string('hash_id', 16)->nullable(true);
            $table->unsignedBigInteger('t_service_billing_id');
            $table->unsignedBigInteger('service_id');
            $table->string('service_type');
            $table->string('name');
            $table->string('description')->nullable();
            $table->decimal('price', 10, 2);
            $table->tinyInteger('type')->default(0);
            $table->tinyInteger('status')->default(0);
            $table->timestamps();

            $table->foreign('t_service_billing_id')
                ->references('id')
                ->on('t_service_billing');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('t_service_billing_detail');
    }
}
