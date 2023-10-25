<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PlayerAnnouncement extends Model
{
	use HasFactory;

	protected $table = 'playerannouncement';

	public function scopeSelectColumns($query)
	{
		return $query->addSelect(
			'playerannouncement.playerAnnouncementID',
			'playerannouncement.announcementName',
			'playerannouncement.dateTimeStart',
			'playerannouncement.dateTimeExpire',
			'playerannouncement.buttonUrl',
			'playerannouncement.buttonText',
			'playerannouncement.buttonAlignment',
			'announcementtemplatecontent.content',
			'announcementtemplatecontent.picture',
			'announcementtemplate.announcementType'
		);
	}

	public function scopeWhereNotExpired($query)
	{
		return $query->where(function ($query) {
			$query
				->whereRaw('playerannouncement.dateTimeExpire > NOW()')
				->orWhereNull('playerannouncement.dateTimeExpire');
		});
	}

	public function scopeOrderByPriority($query)
	{
		return $query
			->orderBy('announcementtemplate.announcementType')
			->orderBy('playerannouncement.announcementPriority')
			->orderBy('playerannouncement.dateTimeStart', 'desc');
	}

	public function scopeWhereClientID($query, $clientID)
	{
		return $query->where(function ($query) use ($clientID) {
			$query
				->where('playerannouncementrecipient.clientID', $clientID)
				->orWhereNull('playerannouncementrecipient.clientID');
		});
	}

	public function scopeWhereProductID($query, $productID)
	{
		return $query->where(function ($query) use ($productID) {
			$query
				->where('playerannouncementproduct.productID', $productID)
				->orWhereNull('playerannouncementproduct.productID');
		});
	}

	public function scopeWhereActiveStatus($query)
	{
		return $query->where('announcementtemplate.status', 1)
			->where('playerannouncement.isPlay', 1);
	}
}
