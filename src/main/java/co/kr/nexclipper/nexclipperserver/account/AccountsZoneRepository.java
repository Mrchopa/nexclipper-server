package co.kr.nexclipper.nexclipperserver.account;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

public interface AccountsZoneRepository extends JpaRepository<AccountsZone, Long> {
	List<AccountsZone> findAllByUserId(Long userId);
}
