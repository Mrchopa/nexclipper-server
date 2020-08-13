package co.kr.nexclipper.nexclipperserver.account;

public enum Platform {
	BAREMETAL,
	K8S,
	AWS;
	
	public static Platform toPlatform(String str) {
		return Platform.valueOf(str.toUpperCase());
	}
}
