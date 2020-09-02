package co.kr.nexclipper.nexclipperserver.account.entity;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Table;

import co.kr.nexclipper.nexclipperserver.account.Platform;
import co.kr.nexcloud.framework.jpa.BaseModel;


@Entity
@Table(name="ACCOUNTS_ZONE")
public class AccountsZone extends BaseModel<Long> {
	private static final long serialVersionUID = -769609915721814401L;
	
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;
	private String name;
	private String platform;
	private String description;
	private Long userId;
	private boolean isInit;
	private String dashboardUrl;
	
	public AccountsZone() {}
	
	public AccountsZone(String name, String platform, String description) {
		this.name = name;
		this.platform = Platform.toPlatform(platform).name();
		this.description = description;
	}

	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public String getPlatform() {
		return platform;
	}

	public void setPlatform(String platform) {
		this.platform = Platform.toPlatform(platform).name();
	}
	
	public void setPlatform(Platform platform) {
		this.platform = platform.name();
	}

	public String getDescription() {
		return description;
	}

	public void setDescription(String description) {
		this.description = description;
	}

	public Long getUserId() {
		return userId;
	}

	public void setUserId(Long userId) {
		this.userId = userId;
	}

	public boolean isInit() {
		return isInit;
	}

	public void setInit(boolean isInit) {
		this.isInit = isInit;
	}

	public String getDashboardUrl() {
		return dashboardUrl;
	}

	public void setDashboardUrl(String dashboardUrl) {
		this.dashboardUrl = dashboardUrl;
	}
}
