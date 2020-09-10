package co.kr.nexclipper.nexclipperserver.account.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import co.kr.nexclipper.nexclipperserver.account.entity.ApiKeys;

public interface ApiKeysRepository extends JpaRepository<ApiKeys, Long> {

}
