<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateMCourseTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('m_course', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->string('hash_id')
                ->nullable();
            $table->string('name')
                ->nullable(false);
            $table->integer('time_block_unit');
            $table->string('s_image_folder_path', 128)
                ->nullable();
            $table->string('m_image_folder_path', 128)
                ->nullable();
            $table->string('l_image_folder_path', 128)
                ->nullable();
            $table->string('image_file_name')
                ->nullable();
            $table->string('status', 10)
                ->default('active')
                ->comment('active|inactive');
            $table->tinyInteger('course_type')
                ->nullable();
            $table->unsignedBigInteger('parent_id')
                ->nullable();
            $table->integer('extend_time_block')
                ->nullable();
            $table->integer('extend_cost_block')
                ->nullable();
            $table->tinyInteger('initial_propose_flag')
                ->nullable(false)
                ->default(1);
            $table->tinyInteger('shop_alert_flag')
                ->default(0);
            $table->tinyInteger('user_alert_flag')
                ->default(0);
            $table->integer('alert_notification_time')
                ->nullable();
            $table->tinyInteger('shop_end_time_alert_flag')
                ->default(0);
            $table->tinyInteger('user_end_time_alert_flag')
                ->default(0);
            $table->unsignedBigInteger('modified_by')
                ->nullable();
            $table->timestamps();
            $table->softDeletes();
            $table->unique('hash_id');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('m_course');
    }
}
