<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

use DB;

/**
 * Set rules for models
 *
 */
class BaseModel extends Model
{
	public function scopeBmSelectTransactionType($query, $type)
	{
		return $query->addSelect(DB::raw("'" . ucfirst($type) . "' as transactionType"));
	}

	public function scopeBmWhereInOrEqual($query, $field, $value)
	{
		if (is_array($value)) {
			return $query->whereIn($field, $value);
		} else {
			return $query->where($field, '=', $value);
		}
	}

	public function scopeBmWhereInMulti($query, $values)
	{
		if (count($values) > 0) {
			return $query->where(function ($query) use ($values) {
				foreach ($values as $value) {
					$query->orWhere(function ($query) use ($value) {
						foreach ($value as $field => $fieldValue) {
							$query->where($field, $fieldValue);
						}
					});
				}
			});
		}
	}
}
