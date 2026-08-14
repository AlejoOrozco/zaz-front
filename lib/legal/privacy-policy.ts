export interface PrivacySection {
  heading: string;
  paragraphs: string[];
  items?: string[];
}

export interface PrivacyPolicyCopy {
  title: string;
  updated: string;
  intro: string[];
  sections: PrivacySection[];
}

export const privacyPolicyByLocale: Record<"en" | "es", PrivacyPolicyCopy> = {
  es: {
    title: "Política de tratamiento de datos personales",
    updated: "Vigente desde su publicación en este sitio.",
    intro: [
      "En cumplimiento de la Ley 1581 de 2012, el Decreto 1377 de 2013 y las demás normas que las modifiquen, Alejandro Gómez Orozco, en adelante zaz, adopta esta política para el tratamiento de Datos Personales, en relación con su recolección, uso y transferencia.",
      "La Ley 1581 de 2012 tiene como objetivo: “[…] desarrollar el derecho constitucional que tienen todas las personas a conocer, actualizar y rectificar las informaciones que se hayan recogido sobre ellas en bases de datos o archivos, y los demás derechos, libertades y garantías constitucionales a que se refiere el artículo 15 de la Constitución Política […]”.",
    ],
    sections: [
      {
        heading: "1. Definiciones para efectos de la política de tratamiento",
        paragraphs: [
          "Para efectos de la presente Política, se tendrán en cuenta las definiciones señaladas en la Ley 1581 de 2012:",
        ],
        items: [
          "Titular: Persona natural o jurídica cuyos Datos Personales sean objeto de Tratamiento.",
          "Responsable del Tratamiento: Persona natural o jurídica, pública o privada, que por sí misma o en asocio con otros, decida sobre la base de datos y/o el Tratamiento de los datos. En el caso concreto, zaz se considerará Responsable del Tratamiento.",
          "Encargado del Tratamiento: Persona natural o jurídica, pública o privada, que por sí misma o en asocio con otros, realice el Tratamiento de datos personales por cuenta del Responsable del Tratamiento.",
          "Dato personal: Cualquier información vinculada o que pueda asociarse a una o varias personas naturales determinadas o determinables.",
          "Tratamiento: Cualquier operación o conjunto de operaciones sobre datos personales, tales como la recolección, almacenamiento, uso, circulación o supresión.",
          "Políticas de Tratamiento en materia de protección de Datos Personales: se refiere al presente documento.",
          "Dato Sensible: Aquellos que afectan la intimidad del Titular o cuyo uso indebido puede generar su discriminación.",
        ],
      },
      {
        heading: "2. Principios para el tratamiento de los datos personales",
        paragraphs: [
          "Los principios que rigen el Tratamiento de los Datos Personales (artículo 4 de la Ley 1581 de 2012) son:",
        ],
        items: [
          "Principio de legalidad en materia de Tratamiento de Datos",
          "Principio de finalidad",
          "Principio de libertad",
          "Principio de veracidad o calidad",
          "Principio de transparencia",
          "Principio de acceso y circulación restringida",
          "Principio de seguridad",
          "Principio de confidencialidad",
        ],
      },
      {
        heading: "3. Autorización para el tratamiento de datos personales",
        paragraphs: [
          "zaz, al momento de la recolección de Datos Personales, solicitará una autorización a los Titulares, informando las finalidades específicas del Tratamiento para las cuales se obtiene dicho consentimiento. En este sitio, esa autorización se otorga al enviar un mensaje o una solicitud de reunión.",
        ],
      },
      {
        heading: "4. Finalidades del Tratamiento de Datos Personales",
        paragraphs: [
          "Los Datos Personales de los Titulares son recolectados por zaz en desarrollo de su actividad, con la finalidad de:",
        ],
        items: [
          "Gestión administrativa y de la relación comercial.",
          "Contactar, informar y responder solicitudes de reunión o de contacto.",
          "Ofrecer y prestar servicios de diseño y desarrollo de software.",
          "Enviar información relacionada con el servicio, cuando resulte pertinente.",
          "Gestión de facturación e histórico de relaciones comerciales.",
          "Cualquier otra finalidad que resulte del contrato o de la relación comercial entre zaz y el Titular.",
        ],
      },
      {
        heading: "Uso y conservación",
        paragraphs: [
          "La información suministrada por el Titular solo será utilizada para los propósitos aquí señalados. Cuando cese la necesidad del Tratamiento, los datos podrán eliminarse de las bases de datos de zaz o archivarse en términos seguros, para divulgarse únicamente cuando la ley así lo exija.",
        ],
      },
      {
        heading: "5. Tipo de Datos Personales que son incluidos en las bases de datos",
        paragraphs: [
          "Los datos recolectados por zaz a través de este sitio son, principalmente: nombre, correo electrónico, teléfono y el contenido del mensaje o de la solicitud de reunión. En el curso de una relación comercial podrán incluirse otros datos necesarios para prestar el servicio, como ocupación, empresa o información de facturación.",
        ],
      },
      {
        heading: "6. Procedimientos para el tratamiento de los datos personales",
        paragraphs: [
          "Los Datos Personales incluidos en las bases de datos de zaz provienen de la información recopilada en ejercicio de actividades comerciales, contractuales o de cualquier otra índole con usuarios, clientes, proveedores y el público en general.",
          "En este sitio, la recolección se realiza a través de los formularios de contacto y de reserva de reunión. Esa actividad supone la autorización previa, expresa e informada del Titular.",
        ],
      },
      {
        heading: "6.1 Procedimiento para conocer, actualizar, rectificar o suprimir información",
        paragraphs: [
          "Para proteger y mantener la confidencialidad de los Datos Personales, el Titular puede presentar su solicitud a través del formulario de contacto de este sitio o escribiendo al correo electrónico indicado más adelante.",
        ],
      },
      {
        heading: "6.2 Procedimiento para suprimir información y revocar la autorización",
        paragraphs: [
          "Los Titulares podrán, en todo momento, solicitar a zaz la supresión de sus datos y/o revocar la autorización, mediante la presentación de un reclamo de acuerdo con lo establecido en el artículo 15 de la Ley 1581 de 2012.",
        ],
      },
      {
        heading: "6.3 Información y mecanismos de contacto",
        paragraphs: [
          "Responsable del Tratamiento: Alejandro Gómez Orozco (zaz).",
          "Para ejercer sus derechos, use el formulario de contacto de este sitio o solicite una reunión. zaz responderá las consultas y reclamos en los términos señalados en la ley.",
        ],
      },
      {
        heading: "7. Derechos del titular de los datos personales",
        paragraphs: [
          "Los derechos que le asisten al titular de los datos personales suministrados son:",
        ],
        items: [
          "Conocer, actualizar y rectificar sus datos personales frente a los responsables del tratamiento o encargados del tratamiento.",
          "Solicitar prueba de la autorización otorgada al responsable del tratamiento, salvo las excepciones previstas en la Ley 1581 de 2012.",
          "Ser informado por el responsable del tratamiento o el encargado del tratamiento, previa solicitud, respecto del uso dado a sus datos personales.",
          "Presentar quejas ante la Superintendencia de Industria y Comercio por infracciones a lo dispuesto en la Ley.",
          "Revocar la autorización otorgada al responsable del tratamiento y/o solicitar la supresión del dato cuando en el tratamiento no se respeten los principios, derechos y garantías constitucionales y legales. Esta revocatoria o supresión procederá cuando la Superintendencia de Industria y Comercio haya determinado que el responsable o encargado del tratamiento han incurrido en conductas contrarias a la Ley 1581 de 2012 o la Constitución.",
        ],
      },
      {
        heading: "8. Deberes del responsable del tratamiento",
        paragraphs: ["zaz, como responsable del tratamiento, se obliga a:"],
        items: [
          "Garantizar al Titular, en todo tiempo, el pleno y efectivo ejercicio del derecho de hábeas data.",
          "Solicitar y conservar, en las condiciones previstas en la ley, copia de la respectiva autorización otorgada por el Titular.",
          "Informar debidamente al Titular sobre la finalidad de la recolección y los derechos que le asisten por virtud de la autorización otorgada.",
          "Conservar la información bajo las condiciones de seguridad necesarias para impedir su adulteración, pérdida, consulta, uso o acceso no autorizado o fraudulento.",
          "Garantizar que la información que se suministre al Encargado del Tratamiento sea veraz, completa, exacta, actualizada, comprobable y comprensible.",
          "Actualizar la información, comunicando de forma oportuna al Encargado del Tratamiento todas las novedades respecto de los datos que previamente le haya suministrado, y adoptar las demás medidas necesarias para que la información suministrada a éste se mantenga actualizada.",
          "Rectificar la información cuando sea incorrecta y comunicar lo pertinente al Encargado del Tratamiento.",
          "Tramitar las consultas y reclamos formulados en los términos señalados en la ley.",
          "Adoptar un manual interno de políticas y procedimientos para garantizar el adecuado cumplimiento de la ley y, en especial, para la atención de consultas y reclamos.",
          "Informar, a solicitud del Titular, sobre el uso dado a sus datos.",
          "Informar a la autoridad de protección de datos cuando se presenten violaciones a los códigos de seguridad y existan riesgos en la administración de la información de los Titulares.",
          "Cumplir las instrucciones y requerimientos que imparta la Superintendencia de Industria y Comercio.",
        ],
      },
      {
        heading: "9. Vigencia de la política",
        paragraphs: [
          "La presente Política de Tratamiento de Datos Personales rige a partir de su publicación. zaz puede modificarla en cualquier tiempo para adaptarla a novedades legislativas o jurisprudenciales, así como a mejores prácticas sobre el tema, caso en el cual se informará oportunamente a los Titulares.",
          "Cualquier modificación o actualización se publicará en esta página, con indicación de la fecha de entrada en vigencia de la correspondiente modificación o actualización.",
          "El uso de este sitio o de los servicios que ofrece zaz, o la no desvinculación de los mismos después de publicada la nueva Política, constituye la aceptación de la misma.",
          "Los Datos Personales o bases de datos sujetas a Tratamiento estarán vigentes por el término de la relación con el Titular, más el término que establezca la ley.",
        ],
      },
    ],
  },
  en: {
    title: "Personal data processing policy",
    updated: "Effective from its publication on this site.",
    intro: [
      "In accordance with Colombian Law 1581 of 2012, Regulatory Decree 1377 of 2013, and any later amendments, Alejandro Gómez Orozco, hereinafter zaz, adopts this policy for the processing of Personal Data, covering collection, use, and transfer.",
      "Law 1581 of 2012 aims to: “[…] develop the constitutional right of every person to know, update, and rectify information collected about them in databases or files, and the other constitutional rights, freedoms, and guarantees referred to in article 15 of the Political Constitution […]”.",
    ],
    sections: [
      {
        heading: "1. Definitions for this processing policy",
        paragraphs: [
          "For the purposes of this Policy, the definitions set out in Law 1581 of 2012 apply:",
        ],
        items: [
          "Data Subject (Titular): Natural or legal person whose Personal Data is subject to Processing.",
          "Controller (Responsable del Tratamiento): Natural or legal person, public or private, that, alone or jointly, decides on the database and/or the Processing of the data. In this case, zaz is the Controller.",
          "Processor (Encargado del Tratamiento): Natural or legal person, public or private, that, alone or jointly, processes personal data on behalf of the Controller.",
          "Personal data: Any information linked or that may be associated with one or more identified or identifiable natural persons.",
          "Processing: Any operation or set of operations on personal data, such as collection, storage, use, circulation, or deletion.",
          "Personal Data Processing Policies: this document.",
          "Sensitive data: Data that affect the Data Subject’s privacy or whose misuse may lead to discrimination.",
        ],
      },
      {
        heading: "2. Principles for the processing of personal data",
        paragraphs: [
          "The principles that govern the Processing of Personal Data (article 4 of Law 1581 of 2012) are:",
        ],
        items: [
          "Principle of legality in data processing",
          "Principle of purpose",
          "Principle of freedom",
          "Principle of accuracy or quality",
          "Principle of transparency",
          "Principle of restricted access and circulation",
          "Principle of security",
          "Principle of confidentiality",
        ],
      },
      {
        heading: "3. Authorization for the processing of personal data",
        paragraphs: [
          "When collecting Personal Data, zaz will request authorization from the Data Subject and inform the specific purposes of the Processing. On this site, that authorization is given when you send a message or a meeting request.",
        ],
      },
      {
        heading: "4. Purposes of Personal Data Processing",
        paragraphs: [
          "zaz collects Personal Data in the course of its work, for the following purposes:",
        ],
        items: [
          "Administrative management and the commercial relationship.",
          "Contacting you and responding to meeting or contact requests.",
          "Offering and providing software design and development services.",
          "Sending information related to the service, when relevant.",
          "Invoicing and a record of the commercial relationship.",
          "Any other purpose that arises from the contract or commercial relationship between zaz and the Data Subject.",
        ],
      },
      {
        heading: "Use and retention",
        paragraphs: [
          "Information provided by the Data Subject will only be used for the purposes stated here. When Processing is no longer needed, the data may be deleted from zaz’s databases or archived securely, to be disclosed only when the law requires it.",
        ],
      },
      {
        heading: "5. Types of Personal Data included in the databases",
        paragraphs: [
          "Data collected by zaz through this site are mainly: name, email, phone, and the content of the message or meeting request. In the course of a commercial relationship, other data needed to provide the service may be included, such as occupation, company, or billing information.",
        ],
      },
      {
        heading: "6. Procedures for processing personal data",
        paragraphs: [
          "Personal Data in zaz’s databases come from information gathered through commercial, contractual, or other relationships with users, clients, suppliers, and the public.",
          "On this site, collection happens through the contact and meeting-request forms. That activity implies the Data Subject’s prior, express, and informed authorization.",
        ],
      },
      {
        heading: "6.1 Procedure to know, update, rectify, or delete information",
        paragraphs: [
          "To protect and keep Personal Data confidential, the Data Subject may submit a request through this site’s contact form or by writing to the email indicated below.",
        ],
      },
      {
        heading: "6.2 Procedure to delete information and revoke authorization",
        paragraphs: [
          "Data Subjects may, at any time, ask zaz to delete their data and/or revoke authorization by filing a claim in accordance with article 15 of Law 1581 of 2012.",
        ],
      },
      {
        heading: "6.3 Contact information",
        paragraphs: [
          "Controller: Alejandro Gómez Orozco (zaz).",
          "To exercise your rights, use this site’s contact form or request a meeting. zaz will handle queries and claims within the timeframes set by law.",
        ],
      },
      {
        heading: "7. Rights of the personal data subject",
        paragraphs: [
          "The Data Subject of the personal data provided has the following rights:",
        ],
        items: [
          "To know, update, and rectify their personal data vis-à-vis the controllers or processors.",
          "To request proof of the authorization granted to the controller, except for the exceptions provided in Law 1581 of 2012.",
          "To be informed by the controller or the processor, upon request, of the use given to their personal data.",
          "To file complaints with the Superintendence of Industry and Commerce for violations of the Law.",
          "To revoke the authorization granted to the controller and/or request deletion of the data when processing does not respect constitutional and legal principles, rights, and guarantees. Such revocation or deletion shall proceed when the Superintendence of Industry and Commerce has determined that the controller or processor has engaged in conduct contrary to Law 1581 of 2012 or the Constitution.",
        ],
      },
      {
        heading: "8. Duties of the controller",
        paragraphs: ["As controller, zaz undertakes to:"],
        items: [
          "Guarantee the Data Subject, at all times, the full and effective exercise of the right of habeas data.",
          "Request and keep, under the conditions provided by law, a copy of the authorization granted by the Data Subject.",
          "Duly inform the Data Subject of the purpose of collection and the rights that arise from the authorization granted.",
          "Keep the information under the security conditions necessary to prevent alteration, loss, consultation, use, or unauthorized or fraudulent access.",
          "Ensure that information supplied to a Processor is truthful, complete, accurate, up to date, verifiable, and understandable.",
          "Update the information, promptly informing the Processor of all changes regarding data previously supplied, and adopt the other measures needed to keep that information current.",
          "Rectify the information when it is incorrect and communicate that to the Processor.",
          "Handle queries and claims in the terms set by law.",
          "Adopt an internal manual of policies and procedures to ensure proper compliance with the law and, in particular, to handle queries and claims.",
          "Inform, at the Data Subject’s request, of the use given to their data.",
          "Inform the data-protection authority when security codes are breached and there are risks in the administration of Data Subjects’ information.",
          "Comply with the instructions and requirements issued by the Superintendence of Industry and Commerce.",
        ],
      },
      {
        heading: "9. Term of the policy",
        paragraphs: [
          "This Personal Data Processing Policy is effective from its publication. zaz may amend it at any time to adapt it to legislative or case-law developments, as well as to better practices on the subject, in which case Data Subjects will be informed in due course.",
          "Any amendment or update will be published on this page, with the effective date of the corresponding change.",
          "Use of this site or of the services offered by zaz, or remaining linked to them after the new Policy is published, constitutes acceptance of it.",
          "Personal Data or databases subject to Processing will remain in effect for the term of the relationship with the Data Subject, plus any additional term required by law.",
        ],
      },
    ],
  },
};
