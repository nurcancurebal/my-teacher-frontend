import i18n from "i18next";
import { initReactI18next } from "react-i18next";

// the translations
// (tip move them in a JSON file and import them,
// or even better, manage them separated from your code: https://react.i18next.com/guides/multiple-translation-files)
const resources = {
  EN: {
    translation: {
      UNKNOWN_ERROR: "An error occurred. Please try again.",
      DASHBOARD: "Dashboard",
      LOGIN_TO_YOUR_ACCOUNT: "Login to your account",
      LOGOUT: "Logout",
      CLASSES: "Classes",
      STUDENTS: "Students",
      GRADES: "Grades",
      UPDATE_PROFILE: "Update Profile",
      CLASS_NOT_FOUND_ADD_CLASS_FIRST:
        "Class not found. Please add a class first.",
      NO_STUDENTS_FOUND_CLASS: "No students found in class.",
      CLASS_SELECTION_WAS_NOT_MADE: "Class selection was not made.",
      BEING_DIRECTED_TO_ADD_NOTE: "You are being directed to add a note.",
      THERE_ARE_NO_NOTES_CLASS: "There are no notes in the class.",
      CLASS_SELECTION_NOT_MADE: "Class selection was not made.",
      BEING_DIRECTED_TO_UPDATE_YOUR_NOTE:
        "You are being directed to update your note.",
      NO_STUDENT_FOUND: "No student found.",
      NO_STUDENTS_WITH_NAME_OR_SURNAME_FOUND:
        "No student found with name or surname.",
      STUDENT_NUMBERS_CAN_CONSIST_OF_NUMERICAL_VALUES:
        "Student numbers can consist of numerical values.",
      NO_STUDENT_FOUND_FOR_THIS_NUMBER: "No student found for this number.",
      GRADE_SUCCESSFULLY_ADDED: "Grade successfully added.",
      CLASS_NOT_FOUND: "Class not found.",
      BEING_REDIRECTED_TO_LOG_IN: "You are being redirected to the login page.",
      GRADES_CAN_BE_NUMERIC: "Grades can be numeric.",
      USER_DATA_NOT_AVAILABLE: "User data is not available.",
      YOU_ARE_BEING_DIRECTED_TO_THE_HOMEPAGE:
        "You are being directed to the homepage.",
      REDIRECTING_TO_HOME_PAGE: "Redirecting to the homepage.",
    },
  },
  TR: {
    translation: {
      UNKNOWN_ERROR: "Bir hata oluştu. Lütfen tekrar deneyin.",
      DASHBOARD: "Önizleme",
      LOGIN_TO_YOUR_ACCOUNT: "Hesabınıza giriş yapın",
      LOGOUT: "Çıkış",
      CLASSES: "Sınıflar",
      STUDENTS: "Öğrenciler",
      GRADES: "Notlar",
      UPDATE_PROFILE: "Profil Güncelleme",
      CLASS_NOT_FOUND_ADD_CLASS_FIRST:
        "Sınıf bulunamadı. Lütfen önce sınıf ekleyin.",
      NO_STUDENTS_FOUND_CLASS: "Sınıfta öğrenci bulunamadı.",
      CLASS_SELECTION_WAS_NOT_MADE: "Sınıf seçimi yapılmadı.",
      BEING_DIRECTED_TO_ADD_NOTE: "Not eklemeye yönlendiriliyorsunuz.",
      THERE_ARE_NO_NOTES_CLASS: "Sınıfta not bulunmamaktadır.",
      CLASS_SELECTION_NOT_MADE: "Sınıf seçimi yapılmadı.",
      BEING_DIRECTED_TO_UPDATE_YOUR_NOTE:
        "Notunuzu güncellemeye yönlendiriliyorsunuz.",
      NO_STUDENT_FOUND: "Öğrenci bulunamadı.",
      NO_STUDENTS_WITH_NAME_OR_SURNAME_FOUND:
        "Adı veya soyadı içeren öğrenci bulunamadı.",
      STUDENT_NUMBERS_CAN_CONSIST_OF_NUMERICAL_VALUES:
        "Öğrenci numaraları sayısal değerlerden oluşabilir.",
      NO_STUDENT_FOUND_FOR_THIS_NUMBER: "Bu numaraya ait öğrenci bulunamadı.",
      GRADE_SUCCESSFULLY_ADDED: "Notlar başarıyla eklendi.",
      CLASS_NOT_FOUND: "Sınıf bulunamadı.",
      BEING_REDIRECTED_TO_LOG_IN: "Giriş sayfasına yönlendiriliyorsunuz.",
      GRADES_CAN_BE_NUMERIC: "Notlar sayısal olabilir.",
      USER_DATA_NOT_AVAILABLE: "Kullanıcı verileri mevcut değil.",
      YOU_ARE_BEING_DIRECTED_TO_THE_HOMEPAGE:
        "Anasayfaya yönlendiriliyorsunuz.",
      REDIRECTING_TO_HOME_PAGE: "Anasayfaya yönlendiriliyorsunuz.",
    },
  },
};

i18n
  .use(initReactI18next) // passes i18n down to react-i18next
  .init({
    resources,
    lng: "EN", // language to use, more information here: https://www.i18next.com/overview/configuration-options#languages-namespaces-resources
    // you can use the i18n.changeLanguage function to change the language manually: https://www.i18next.com/overview/api#changelanguage
    // if you're using a language detector, do not define the lng option

    interpolation: {
      escapeValue: false, // react already safes from xss
    },
  });

export default i18n;
