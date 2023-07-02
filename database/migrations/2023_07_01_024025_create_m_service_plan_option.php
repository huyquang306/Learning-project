<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateMServicePlanOption extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('m_service_plan_option', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->unsignedBigInteger('m_service_plan_id');
            $table->unsignedBigInteger('m_function_id');
            $table->decimal('additional_price', 10, 2)->default(0);
            $table->timestamps();
            $table->softDeletes();

            $table->foreign('m_service_plan_id')
                ->references('id')
                ->on('m_service_plan');
            $table->foreign('m_function_id')
                ->references('id')
                ->on('m_function');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('m_service_plan_option');
    }
}
