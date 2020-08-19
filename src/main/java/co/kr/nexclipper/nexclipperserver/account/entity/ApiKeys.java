package co.kr.nexclipper.nexclipperserver.account.entity;

import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.Table;

import co.kr.nexcloud.framework.jpa.BaseModel;

@Entity
@Table(name="API_KEYS")
public class ApiKeys extends BaseModel<Long> {
	private static final long serialVersionUID = 5596749945171184075L;

	@Id
	private Long userId;
	
	private String apiKey;
	
	public Long getId() {
		return getUserId();
	}

	public Long getUserId() {
		return userId;
	}

	public void setUserId(Long userId) {
		this.userId = userId;
	}

	public String getApiKey() {
		return apiKey;
	}

	public void setApiKey(String apiKey) {
		this.apiKey = apiKey;
	}
}
