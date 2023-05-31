<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AlterImageFolderInMItemTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('m_item', function (Blueprint $table) {
            $table->dropColumn('image_folder_path');
            $table->string('s_image_folder_path', 128)->nullable();
            $table->string('m_image_folder_path', 128)->nullable();
            $table->string('l_image_folder_path', 128)->nullable();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('m_item', function (Blueprint $table) {
            $table->dropColumn('s_image_folder_path');
            $table->dropColumn('m_image_folder_path');
            $table->dropColumn('l_image_folder_path');
            $table->string('image_folder_path', 128)->nullable();
        });
    }
}
