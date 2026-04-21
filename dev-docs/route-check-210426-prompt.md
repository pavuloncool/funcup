## PROMPT — MAPOWANIE FLOWÓW APLIKACJI FUNCUP (UX-FIRST, NA BAZIE ROUTINGU)

Założenia projektu: App Router, QR flow, Entry Gate, UX-first

### Kontekst

Aplikacja funcup była rozwijana w sposób niespójny — development koncentrował się głównie na backendzie, bez równoległego uporządkowania frontendowej architektury i flowów użytkownika.

W rezultacie:

* struktura routingu (Next.js App Router) istnieje, ale nie odzwierciedla jasno rzeczywistych flowów użytkownika,
* pierwotne założenia architektury (opisane w dokumentacji) nie odpowiadają aktualnemu stanowi aplikacji.

Celem jest **odtworzenie rzeczywistych flowów aplikacji na podstawie aktualnego kodu**, w szczególności routingu i zachowania UI.

---

## Definicje (obowiązkowe do stosowania)

**Flow (UX flow)**
Sekwencja kroków użytkownika (ekrany + decyzje + akcje), prowadząca od punktu wejścia (*entry point*) do zakończenia (*exit point*), zakończona konkretnym rezultatem (np. zapis danych, zakończenie procesu, błąd).

**Entry Point**
Moment wejścia użytkownika do flow — może to być:

* uruchomienie aplikacji (standardowe wejście),
* deep link (np. QR code),
* bezpośredni dostęp do route’a.

**Exit Point**
Stan końcowy flow:

* sukces (np. zapis oceny),
* przerwanie (np. brak autoryzacji),
* błąd.

**Routing jako źródło pomocnicze, nie nadrzędne**
Routing (Next.js App Router) służy do identyfikacji możliwych ścieżek, ale flowy należy budować na podstawie **rzeczywistego doświadczenia użytkownika (UX)**, nie struktury plików.

---

## Kluczowe założenia aplikacji

* Framework: **Next.js (App Router)**
* Baza danych / backend: **Supabase**
* Core value aplikacji:

  > konsument ocenia produkt na podstawie QR wygenerowanego przez producenta

---

## Główne Entry Pointy UX (obowiązkowe uwzględnienie)

### 1. Standardowy start aplikacji

Dotyczy:

* aplikacji mobilnej (iOS / Android)
* przeglądarki desktop (producer)

Sekwencja:

1. App Launch
2. Animated Splash Screen
3. **Role Selection Gate** (wybór: *producer* / *consumer*)

To jest główny punkt decyzyjny aplikacji.

---

### 2. Deep Entry (QR Code)

Alternatywne wejście:

* użytkownik skanuje QR
* trafia bezpośrednio do konkretnego route’a (np. `/qr/[id]`)

**Ten flow omija Role Selection Gate** i musi być modelowany jako niezależny entry point.

---

## Zadanie

### Etap 1 — Inwentaryzacja routingu

1. Zidentyfikuj wszystkie route’y w aplikacji:

   * `/app/**/page.tsx`
   * `/app/**/route.ts`
   * middleware (jeśli istnieje)

2. Zgrupuj route’y w logiczne kategorie:

   * public
   * consumer
   * producer
   * auth
   * inne (jeśli potrzebne)

---

### Etap 2 — Identyfikacja flowów

Na podstawie:

* routingu
* zachowania UI
* logiki aplikacji

Zidentyfikuj **kompletne flowy użytkownika**, a nie pojedyncze route’y.

Każdy flow musi:

* zaczynać się od jasno określonego entry pointu
* kończyć się exit pointem
* mieć zdefiniowany rezultat

---

### Etap 3 — Sub-diagramy (pojedyncze flowy)

Dla każdego flow przygotuj osobny diagram.

#### Wymagania:

* perspektywa: **UX (user journey)**
* nie skupiaj się na strukturze plików
* uwzględnij:

  * przejścia między ekranami
  * decyzje (np. „czy użytkownik jest zalogowany?”)
  * kluczowe akcje (np. zapis do bazy)
  * momenty błędów / przerwania

#### Format:

* użyj **Mermaid (flowchart lub sequence diagram)**
* zachowaj spójny styl dla wszystkich diagramów

---

### Etap 4 — Diagram high-level (całość aplikacji)

Przygotuj jeden diagram pokazujący:

* wszystkie zidentyfikowane flowy
* ich powiązania
* główne entry pointy:

  * App Launch → Splash → Role Selection Gate
  * QR Scan (deep entry)

#### Wymagania:

* poziom abstrakcji: **produktowy (nie techniczny)**
* diagram ma pokazywać:

  * przepływ użytkownika
  * relacje między flowami
* NIE ma to być diagram routingu

---

## Dodatkowe wytyczne

* Jeśli jakikolwiek element jest niejasny (np. auth, redirecty, warunki wejścia):
  → **zadaj pytanie zamiast zgadywać**
* Jeśli flow jest niekompletny:
  → zaznacz brakujące elementy
* Jeśli istnieją sprzeczności w logice:
  → wskaż je explicite

---

## Cel końcowy

Uzyskać:

* pełną, czytelną mapę flowów aplikacji
* zrozumienie rzeczywistego działania systemu
* podstawę do dalszego refaktoru architektury i UX