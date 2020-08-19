package co.kr.nexclipper.nexclipperserver.account.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import co.kr.nexclipper.nexclipperserver.account.entity.AccountsZone;

public interface AccountsZoneRepository extends JpaRepository<AccountsZone, Long> {
	List<AccountsZone> findAllByUserId(Long userId);
}
