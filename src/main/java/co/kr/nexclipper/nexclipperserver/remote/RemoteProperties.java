package co.kr.nexclipper.nexclipperserver.remote;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.context.properties.ConfigurationProperties;

@ConfigurationProperties(prefix = "nc.remote")
public class RemoteProperties {
	@Value(value = "${nc.remote.klevr.inner-url}")
	private String klevrInnerUrl;
	
	@Value(value = "${nc.remote.klevr.outer-url}")
	private String klevrOuterUrl;

	public String getKlevrInnerUrl() {
		return klevrInnerUrl;
	}

	public void setKlevrInnerUrl(String klevrInnerUrl) {
		this.klevrInnerUrl = klevrInnerUrl;
	}

	public String getKlevrOuterUrl() {
		return klevrOuterUrl;
	}

	public void setKlevrOuterUrl(String klevrOuterUrl) {
		this.klevrOuterUrl = klevrOuterUrl;
	}
}
