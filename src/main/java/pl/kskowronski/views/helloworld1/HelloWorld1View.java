package pl.kskowronski.views.helloworld1;

import java.util.Optional;

import pl.kskowronski.data.entity.Person;
import pl.kskowronski.data.service.PersonService;
import com.vaadin.flow.component.Tag;
import com.vaadin.flow.component.button.Button;
import com.vaadin.flow.component.dependency.JsModule;
import com.vaadin.flow.component.grid.Grid;
import com.vaadin.flow.component.grid.GridVariant;
import com.vaadin.flow.component.notification.Notification;
import com.vaadin.flow.component.polymertemplate.Id;
import com.vaadin.flow.component.polymertemplate.PolymerTemplate;
import com.vaadin.flow.component.textfield.TextField;
import com.vaadin.flow.data.binder.Binder;
import com.vaadin.flow.data.binder.ValidationException;
import com.vaadin.flow.router.PageTitle;
import com.vaadin.flow.router.Route;
import com.vaadin.flow.templatemodel.TemplateModel;

import org.springframework.beans.factory.annotation.Autowired;
import org.vaadin.artur.helpers.CrudServiceDataProvider;
import pl.kskowronski.views.main.MainView;

@Route(value = "hello1", layout = MainView.class)
@PageTitle("Hello World1")
@JsModule("./src/views/helloworld1/hello-world1-view.js")
@Tag("hello-world1-view")
public class HelloWorld1View extends PolymerTemplate<TemplateModel> {

    // This is the Java companion file of a design
    // You can find the design file in 
    // /frontend/src/views/src/views/helloworld1/hello-world1-view.js
    // The design can be easily edited by using Vaadin Designer (vaadin.com/designer)

    // Grid is created here so we can pass the class to the constructor
    private Grid<Person> grid = new Grid<>(Person.class);

    @Id
    private TextField firstName;
    @Id
    private TextField lastName;
    @Id
    private TextField email;

    @Id
    private Button cancel;
    @Id
    private Button save;

    private Binder<Person> binder;

    private Person person = new Person();

    private PersonService personService;

    public HelloWorld1View(@Autowired PersonService personService) {
        setId("hello-world1-view");
        this.personService = personService;
        grid.setColumns("firstName", "lastName", "email");
        grid.setDataProvider(new CrudServiceDataProvider<Person, Void>(personService));
        grid.addThemeVariants(GridVariant.LUMO_NO_BORDER);
        grid.setHeightFull();
        // Add to the `<slot name="grid">` defined in the template
        grid.getElement().setAttribute("slot", "grid");
        getElement().appendChild(grid.getElement());
        
        // when a row is selected or deselected, populate form
        grid.asSingleSelect().addValueChangeListener(event -> {
            if (event.getValue() != null) {
                Optional<Person> personFromBackend= personService.get(event.getValue().getId());
                // when a row is selected but the data is no longer available, refresh grid
                if(personFromBackend.isPresent()){
                    populateForm(personFromBackend.get());
                } else {
                    refreshGrid();
                }
            } else {
                clearForm();
            }
        });

        // Configure Form
        binder = new Binder<>(Person.class);

        // Bind fields. This where you'd define e.g. validation rules
        binder.bindInstanceFields(this);

        cancel.addClickListener(e -> {
            clearForm();
            refreshGrid();
        });

        save.addClickListener(e -> {
            try {
                if (this.person == null) {
                    this.person = new Person();
                }
                binder.writeBean(this.person);
                personService.update(this.person);
                clearForm();
                refreshGrid();
                Notification.show("Person details stored.");
            } catch (ValidationException validationException) {
                Notification.show("An exception happened while trying to store the person details.");
            }
        });
    }

    private void refreshGrid() {
        grid.select(null);
        grid.getDataProvider().refreshAll();
    }

    private void clearForm() {
        populateForm(null);
    }

    private void populateForm(Person value) {
        this.person = value;
        binder.readBean(this.person);
    }
}
