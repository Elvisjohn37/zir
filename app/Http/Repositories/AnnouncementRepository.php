<?php

namespace App\Http\Repositories;

use Vinkla\Hashids\Facades\Hashids;
use App\Models\PlayerAnnouncement;

class AnnouncementRepository extends BaseRepository
{
	private function resultFormatter($result)
	{
		foreach ($result as &$announcement) {
			$announcement['playerAnnouncementID'] = Hashids::encode($announcement['playerAnnouncementID']);
		}

		return $result;
	}

	public function getBeforeLoginAnnouncements()
	{
		$result = PlayerAnnouncement::selectColumns()
			->join(
				'announcementtemplate',
				'announcementtemplate.announcementTemplateID',
				'playerannouncement.announcementTemplateID'
			)
			->join(
				'announcementtemplatecontent',
				'announcementtemplatecontent.announcementTemplateID',
				'announcementtemplate.announcementTemplateID'
			)
			->whereActiveStatus()
			->whereIn('playerannouncement.targetPage', [1, 3])
			->whereNotExpired()
			->orderByPriority()
			->get()
			->toArray();

		return $this->resultFormatter($result);
	}

	public function getAfterLoginAnnouncements($clientID)
	{
		$result = PlayerAnnouncement::selectColumns()
			->join(
				'playerannouncementrecipient',
				'playerannouncementrecipient.playerAnnouncementID',
				'playerannouncement.playerAnnouncementID'
			)
			->join(
				'announcementtemplate',
				'announcementtemplate.announcementTemplateID',
				'playerannouncement.announcementTemplateID'
			)
			->join(
				'announcementtemplatecontent',
				'announcementtemplatecontent.announcementTemplateID',
				'announcementtemplate.announcementTemplateID'
			)
			->whereActiveStatus()
			->whereIn('playerannouncement.targetPage', [2, 3, 5])
			->whereClientID($clientID)
			->whereNotExpired()
			->orderByPriority()
			->get()
			->toArray();

		return $this->resultFormatter($result);
	}

	public function getProductAnnouncements($productID, $clientID)
	{
		$result = PlayerAnnouncement::selectColumns()
			->join(
				'playerannouncementrecipient',
				'playerannouncementrecipient.playerAnnouncementID',
				'playerannouncement.playerAnnouncementID'
			)
			->join(
				'playerannouncementproduct',
				'playerannouncementproduct.playerAnnouncementID',
				'playerannouncement.playerAnnouncementID'
			)
			->join(
				'announcementtemplate',
				'announcementtemplate.announcementTemplateID',
				'playerannouncement.announcementTemplateID'
			)
			->join(
				'announcementtemplatecontent',
				'announcementtemplatecontent.announcementTemplateID',
				'announcementtemplate.announcementTemplateID'
			)
			->whereActiveStatus()
			->whereIn('playerannouncement.targetPage', [4, 5])
			->whereClientID($clientID)
			->whereProductID($productID)
			->whereNotExpired()
			->orderByPriority()
			->get()
			->toArray();

		return $this->resultFormatter($result);
	}
}
