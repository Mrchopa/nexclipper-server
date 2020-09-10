package co.kr.nexclipper.nexclipperserver.controller.view;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;

@Controller
public class IndexController {
//	@RequestMapping("")
//	public String index(@RequestParam(name = "new", required=false) String param) {
//		System.out.println(param);
//		
//		return "redirect:/view/zones";
//	}
	
	@GetMapping("/{path}")
	public String getAny(@PathVariable String path) {
		return path;
	}
}
