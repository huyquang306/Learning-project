<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateRShopServicePlan extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('r_shop_service_plan', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->unsignedBigInteger('m_shop_id');
            $table->unsignedBigInteger('m_service_plan_id');
            $table->tinyInteger('status')->default(0);
            $table->dateTime('end_date')->nullable();
            $table->dateTime('applied_date');
            $table->dateTime('registered_date');
            $table->timestamps();
            $table->softDeletes();

            $table->foreign('m_shop_id')->references('id')->on('m_shop');
            $table->foreign('m_service_plan_id')->references('id')->on('m_service_plan');
            $table->index(['m_shop_id', 'm_service_plan_id']);
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('r_shop_service_plan');
    }
}
