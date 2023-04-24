<?php

namespace App\Repositories\Interfaces;

interface StaffRepositoryInterface extends BaseRepositoryInterface
{
    public function getSAccountByFireBaseUid(string $uid);
}
