package co.kr.nexclipper.nexclipperserver.account.entity;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Table;
import javax.persistence.Transient;

import co.kr.nexclipper.nexclipperserver.account.Platform;
import co.kr.nexcloud.framework.jpa.BaseModel;
import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import io.swagger.annotations.ApiModelProperty.AccessMode;


@Entity
@Table(name="ACCOUNTS_ZONE")
@ApiModel(description = "계정별 ZONE 데이터")
public class AccountsZone extends BaseModel<Long> {
	private static final long serialVersionUID = -769609915721814401L;
	
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@ApiModelProperty(value = "ZONE ID", accessMode = AccessMode.READ_ONLY)
	private Long id;
	
	@ApiModelProperty(value = "ZONE 이름", required = true)
	private String name;
	
	@ApiModelProperty(value = "ZONE 플랫폼 이름", required = true, allowableValues = "baremetal, kubernetes, AWS")
	private String platform;
	
	@ApiModelProperty(value = "ZONE 설명")
	private String description;
	
	@ApiModelProperty(value = "ZONE 소유자 계정 ID", accessMode = AccessMode.READ_ONLY)
	private Long userId;
	
	@ApiModelProperty(value = "ZONE 초기화 완료 여부(primary agent initialize)", accessMode = AccessMode.READ_ONLY)
	private boolean isInit;
	
	@ApiModelProperty(value = "ZONE에 생성된 대시보드 URL", accessMode = AccessMode.READ_ONLY)
	private String dashboardUrl;
	
	@ApiModelProperty(value = "클러스터 이름", accessMode = AccessMode.READ_ONLY)
	private String clusterName;
	
	@ApiModelProperty(value = "Tag (','로 구분)", accessMode = AccessMode.READ_ONLY)
	private String tags;
	
	@Transient
	@ApiModelProperty(value = "에이전트 상태", accessMode = AccessMode.READ_ONLY)
	private String status;
	
	@Transient
	@ApiModelProperty(value = "K8s cluster version", accessMode = AccessMode.READ_ONLY)
	private String version;

	@Transient
	@ApiModelProperty(value = "K8s API endpoint", accessMode = AccessMode.READ_ONLY)
	private String endpoint;
	
	@Transient
	@ApiModelProperty(value = "K8s 계정", accessMode = AccessMode.READ_ONLY)
	private String account;
	
	@Transient
	@ApiModelProperty(value = "클러스터 사이즈", accessMode = AccessMode.READ_ONLY)
	private int size;
	
	@Transient
	@ApiModelProperty(value = "프로메테우스 URL", accessMode = AccessMode.READ_ONLY)
	private String prometheusUrl;
	
	@Transient
	@ApiModelProperty(value = "complete 상태인 task 개수", accessMode = AccessMode.READ_ONLY)
	private int completedTaskCount;
	
	@Transient
	@ApiModelProperty(value = "in-progress 상태인 task 개수", accessMode = AccessMode.READ_ONLY)
	private int inprogressTaskCount;
	
	@Transient
	@ApiModelProperty(value = "pending 상태인 task 개수", accessMode = AccessMode.READ_ONLY, hidden = false)
	private int pendingTaskCount;
	
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

	public String getClusterName() {
		return clusterName;
	}

	public void setClusterName(String clusterName) {
		this.clusterName = clusterName;
	}

	public String getTags() {
		return tags;
	}

	public void setTags(String tags) {
		this.tags = tags;
	}

	public String getStatus() {
		return status;
	}

	public void setStatus(String status) {
		this.status = status;
	}

	public String getVersion() {
		return version;
	}

	public void setVersion(String version) {
		this.version = version;
	}

	public String getEndpoint() {
		return endpoint;
	}

	public void setEndpoint(String endpoint) {
		this.endpoint = endpoint;
	}

	public String getAccount() {
		return account;
	}

	public void setAccount(String account) {
		this.account = account;
	}

	public int getSize() {
		return size;
	}

	public void setSize(int size) {
		this.size = size;
	}

	public String getPrometheusUrl() {
		return prometheusUrl;
	}

	public void setPrometheusUrl(String prometheusUrl) {
		this.prometheusUrl = prometheusUrl;
	}

	public int getCompletedTaskCount() {
		return completedTaskCount;
	}

	public void setCompletedTaskCount(int completedTaskCount) {
		this.completedTaskCount = completedTaskCount;
	}

	public int getInprogressTaskCount() {
		return inprogressTaskCount;
	}

	public void setInprogressTaskCount(int inprogressTaskCount) {
		this.inprogressTaskCount = inprogressTaskCount;
	}

	public int getPendingTaskCount() {
		return pendingTaskCount;
	}

	public void setPendingTaskCount(int pendingTaskCount) {
		this.pendingTaskCount = pendingTaskCount;
	}
}
