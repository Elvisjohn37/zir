<?php

namespace Tests\Mock\Http\Repositories;

use App\Http\Repositories\AnnouncementRepository;

trait AnnouncementRepositoryMock
{
	private $announcementRepository;

	protected function mockAnnouncementRepository()
	{
		if ($this->announcementRepository === null) {
			$this->announcementRepository = $this->createMock(AnnouncementRepository::class);
		}

		return $this->announcementRepository;
	}

	protected function stubAnnouncementRepositoryGetAfterLoginAnnouncements()
	{
		$this->mockAnnouncementRepository()
			->method('getAfterLoginAnnouncements')
			->willReturn('afterLoginAnnouncement');

		return $this->announcementRepository;
	}

	protected function stubAnnouncementRepositoryGetBeforeLoginAnnouncements()
	{
		$this->mockAnnouncementRepository()
			->method('getBeforeLoginAnnouncements')
			->willReturn('beforeLoginAnnouncements');

		return $this->announcementRepository;
	}

	protected function stubAnnouncementRepositoryGetProductAnnouncements()
	{
		$this->mockAnnouncementRepository()
			->method('getProductAnnouncements')
			->will(
				$this->returnCallback(function ($productID, $clientID) {
					return 'product' . $productID . 'client' . $clientID;
				})
			);

		return $this->announcementRepository;
	}
}
