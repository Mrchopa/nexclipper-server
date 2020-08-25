package co.kr.nexclipper.nexclipperserver.account;

public enum Platform {
	BAREMETAL,
	kubernetes,
	AWS;
	
	public static Platform toPlatform(String str) {
		return Platform.valueOf(str);
	}
}
