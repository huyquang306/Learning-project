<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

class CreateMTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('m_table', function (Blueprint $table) {
            $table->bigIncrements('id')->comment('Primary key');
            $table->unsignedBigInteger('m_shop_id')
                ->nullable(false)
                ->comment('FK reference to MShop');
            $table->string('code', 20)
                ->nullable(false)
                ->comment('Table name');
            $table->boolean('status')
                ->default(true)
                ->comment('Table status');

            $table->timestamp('created_at')
                ->useCurrent();
            $table->timestamp('updated_at')
                ->default(DB::raw('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP'));
            $table->softDeletes();
            $table->unsignedBigInteger('modified_by')
                ->nullable(true);
            $table->foreign('m_shop_id')
                ->references('id')
                ->on('m_shop');
            $table->index(['m_shop_id']);
            $table->index(['m_shop_id', 'code']);
        });
        DB::statement("ALTER TABLE `m_table` comment 'Table master data'");
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('m_table');
    }
}
