<?php

namespace App\Http\Repositories;

use App\Models\Currency;

class ReferenceRepository extends BaseRepository
{
    public function getCurrencyID($currencyCode) {
        return Currency::select('currencyID')->where('currencyCode', '=', $currencyCode)->value('currencyID');
    }
}
