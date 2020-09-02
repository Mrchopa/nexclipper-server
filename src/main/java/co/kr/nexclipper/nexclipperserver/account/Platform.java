package co.kr.nexclipper.nexclipperserver.account;

public enum Platform {
	baremetal,
	kubernetes,
	AWS;
	
	public static Platform toPlatform(String str) {
		return Platform.valueOf(str);
	}
}
