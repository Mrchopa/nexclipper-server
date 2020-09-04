package co.kr.nexclipper.nexclipperserver.controller.converter;

import java.beans.PropertyEditorSupport;

public class EnumParameterConverter<T extends Enum<T>> extends PropertyEditorSupport {
	private Class<T> clz;
	
	public EnumParameterConverter(Class<T> clz) {
		this.clz = clz;
	}
	
	@Override
	public void setAsText(String text) throws IllegalArgumentException {
		setValue(Enum.valueOf(clz, text));
	}
}