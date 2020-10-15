package pl.kskowronski.views.about;

import com.vaadin.flow.component.Tag;
import com.vaadin.flow.component.dependency.JsModule;
import com.vaadin.flow.component.polymertemplate.PolymerTemplate;
import com.vaadin.flow.router.PageTitle;
import com.vaadin.flow.router.Route;
import com.vaadin.flow.templatemodel.TemplateModel;
import pl.kskowronski.views.about.AboutView.AboutViewModel;
import pl.kskowronski.views.main.MainView;

@Route(value = "", layout = MainView.class)
@PageTitle("About")
@JsModule("./src/views/about/about-view.js")
@Tag("about-view")
public class AboutView extends PolymerTemplate<AboutViewModel> {

    // This is the Java companion file of a design
    // You can find the design file in /frontend/src/views/src/views/about/about-view.js
    // The design can be easily edited by using Vaadin Designer (vaadin.com/designer)

    public static interface AboutViewModel extends TemplateModel {
    }

    public AboutView() {
    }
}
