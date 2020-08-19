package co.kr.nexclipper.nexclipperserver.remote.data;

import co.kr.nexclipper.nexclipperserver.account.entity.AccountsZone;

public class AgentGroup {
	private Long id;
	
	private String groupName;
	
	private Long userId;
	
	private String platform;
	
	public AgentGroup() {}
	
	public AgentGroup(AccountsZone zone) {
		this.id = zone.getId();
		this.groupName = zone.getName();
		this.userId = zone.getUserId();
		this.platform = zone.getPlatform();
	}

	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public String getGroupName() {
		return groupName;
	}

	public void setGroupName(String groupName) {
		this.groupName = groupName;
	}

	public Long getUserId() {
		return userId;
	}

	public void setUserId(Long userId) {
		this.userId = userId;
	}

	public String getPlatform() {
		return platform;
	}

	public void setPlatform(String platform) {
		this.platform = platform;
	}
}
