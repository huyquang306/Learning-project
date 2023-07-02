<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateRServicePlanCondition extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('r_service_plan_condition', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->unsignedBigInteger('m_service_plan_id');
            $table->unsignedBigInteger('r_function_condition_id');
            $table->timestamps();
            $table->softDeletes();

            $table->foreign('m_service_plan_id')
                ->references('id')
                ->on('m_service_plan');
            $table->foreign('r_function_condition_id')
                ->references('id')
                ->on('r_function_condition');
            $table->index(
                ['m_service_plan_id', 'r_function_condition_id'],
                'm_service_plan_unique');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('r_service_plan_condition');
    }
}
