<?php

namespace App\Services\Auth;

use Illuminate\Contracts\Auth\Authenticatable;
use Illuminate\Contracts\Auth\Guard;
use Illuminate\Support\Facades\Log;

class FirebaseGuard implements Guard
{
    protected $user;

    public function __construct(FirebaseUserProvider $provider) {
        $this->user = $provider->user();
    }

    public function check(): bool
    {
        Log::notice("FirebaseGuard check()");
        Log::notice($this->user);
        Log::notice($this->user != null);

        return $this->user != null;
    }

    /**
     * @throws \Exception
     */
    public function guest()
    {
        throw new \Exception("FirebaseGuard guest is not available");
    }

    /**
     * @return Authenticatable|null
     */
    public function user(): ?Authenticatable
    {
        return $this->user;
    }

    /**
     * @return int|mixed|string|null
     */
    public function id()
    {
        return $this->user->getAuthIdentifier();
    }

    /**
     * @throws \Exception
     */
    public function validate(array $credentials = [])
    {
        throw new \Exception("FirebaseGuard validate is not available");
    }

    /**
     * @throws \Exception
     */
    public function setUser(Authenticatable $user)
    {
        throw new \Exception("FirebaseGuard validate is not available");
    }
}
