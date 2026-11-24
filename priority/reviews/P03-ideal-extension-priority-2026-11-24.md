# P03 — تحقيق متخصص في أسبقية الإنشاء الجبري وامتداد الزوجية
24/11/2026. مراجعة داخلية، لا تحكيم خارجي. مرجع المخطوطة v0.5: commit a93a7e45988173a3648613ffaaf7e3cc23ed8e27. لا تعديل main أو ترقيم القضايا. 

## نطاق البحث
المطالبة: امتدادات مونويدية مسماة ذات معلومات بنيوية وتوليدية متماثلة، يتغير فيها فراغ مجموعة العناصر الضرورية ويظل القرار تربيعي الاستعلام. التركيز على الإنشاء نفسه، لا على حد OR المجرد.
استعلامات الويب الفعلية:
- finite semigroups same Green relations principal factors nonisomorphic ideal extension multiplication structure
- semigroup ideal extensions null semigroup partial homomorphism extensions by rectangular bands translational hull
- semigroup generating sets generating polynomial same number irredundant generating sets invariants
- finite groups generating polynomial number generating subsets same polynomial nonisomorphic groups generating sets
- reliability polynomial hypergraph equal reliability polynomial essential vertices generating sets
- semigroup "ideal extensions" "null" semigroup "factor" associativity translational hull non reductive
- semigroup ideal extensions null semigroup by band classification left zero right zero semigroup
- finite semigroups "same" "principal factors" Green relations nonisomorphic
- finite groups "probabilistic zeta function" nonisomorphic same generating probability polynomial
- "ramification function" semigroup extensions null semigroup
- semigroup ideal extension "null semigroup" ramification function Clifford Yoshida
- semigroup "ideal extensions" "interchangeable" elements null ideal multiplication
- semigroup "generating sets" "ideal extension" irredundant generating set count
بحث ويب محدود، لا نفاذ مباشر إلى الفهارس المتخصصة ولا حصر للاستشهادات.

## المصادر والفروق
| المصدر | نطاق الفحص | العلاقة |
|---|---|---|
| P. A. Grillet and M. Petrich, Ideal extensions of semigroups, Pacific J. Math. 26(3) (1968), 493–508, https://msp.org/pjm/1968/26-3/pjm-v26-n3-p09-s.pdf | نص PDF، المقدمة ص493، Definition 1.1/Theorem 1.2، Theorems 2.5, 2.11, 2.13, 3.1, 4.1؛ صور الصفحات 493،501،503 والغلاف | KNOWN للإطار النظري: خارج قسمة Rees، أفعال الامتداد على المثالي، ramification function لتحديد النواتج التي تسقط فيه؛ يشير إلى Clifford وYoshida. في القسم 4 يفترض المثالي weakly reductive، بينما مثالنا K ليس كذلك. لا تطابق مثبت مع مصفوفاتنا المقيدة وتوازن إحصاءات التوليد. |
| J. Renshaw, W. Warhurst, Semilattices of stratified extensions, Semigroup Forum 108 (2024), 690–706, https://doi.org/10.1007/s00233-024-10447-5 | HTML، §1 تعريف interchangeable وweakly reductive، §2 وProposition 2.5 | KNOWN لمفهوم تساوي الترجمات، ومثال امتداد عام. لا يثبت المزيج المطلوب. مصطلح base في المقال يعني تقاطع قوى S، لا قاعدة توليد. E(S) فيه idempotents لا E لدينا. |
| J. Jonušas, S. Troscheit, Random ubiquitous transformation semigroups, Semigroup Forum 99 (2019), 655–678, https://doi.org/10.1007/s00233-018-09992-7 | HTML §1 وTheorem 1.1، التعريف وAlgorithm 2 ومقدمة | KNOWN لاسم ubiquitous: كل قواعد التوليد غير الزائدة ذات حجم الرتبة. مونويدات T54–T56 من هذا النوع بموجب التوصيف؛ لا ادعاء جدة تساوي أحجام القواعد. لا نتيجة مطابقة لتوازن عددها مع تغير E. |
| The probabilistic zeta function of finite simple groups, https://www.sciencedirect.com/science/article/pii/S0021869307001883 ؛ Recognizing the characteristic of a simple group of Lie type from its Probabilistic Zeta function, https://www.sciencedirect.com/science/article/pii/S0021869310006290 | الملخصات؛ تعذر فتح الأول (403) | PARTIAL_OVERLAP: استرجاع خصائص من احتمالات توليد الزمر. ليست T56 ولا تعالج مثاليّات مونويدات. |
| Computing finite semigroups, https://doi.org/10.1016/j.jsc.2018.01.002 | ملخص ومقتطف §2 | KNOWN للأدوات البنيوية والحساب من مولدات؛ لا تطابق استعلامي تحت بيانات الامتداد الثابتة. |
| Easy multiplications II. Extensions of rational semigroups, https://www.academia.edu/50191401/Easy_multiplications_II_Extensions_of_rational_semigroups | مقتطف مفهرس فقط؛ لم يفتح النص | استعمال ramification في امتدادات rational؛ لا حكم تفصيلي قبل قراءة الأصل. |

حكم الجولة: PARTIAL_OVERLAP قوي على مستوى نظرية الامتداد والأدوات؛ NO_MATCH_YET للمطالبة المقيدة بتثبيت الإحصاءات وتعقيد الاستعلام. لا يمكن من البحث السلبي إثبات الأسبقية. لا دعوى ابتكار الامتدادات أو دوال التشعب أو ubiquitous semigroups.

## 1. تفسير كلاسيكي لحرية الإنشاء
في T49 ضع K={t,z}. كل ضرب داخل K يساوي z، ومن ثم t وz مختلفان ولهما نفس الترجمتين اليسرى واليمنى على K. K مثالي غير weakly reductive، وليس المونويد نفسه كذلك (كل مونويد weakly reductive لوجود المحايد). 
المعطيات التالية لا تتغير بتغير المصفوفة: جدول K؛ خارج قسمة Rees M/K المسـمى (دمج K في صفر واحد)، وكل حاصل ax,xa حيث a∈M وx∈K. على الخارج، A×B وB×A ينتجان صفر القسمة. في الداخل لا تميز ترجمات K بين t,z.
وبالمقابل إذا كان K weakly reductive، فإن المعطيات الثلاث تحدد ضرب أي امتداد على حامل مسمى: خارج K يعين خارج القسمة الناتج متى كان غير صفري، وأي ناتج ab∈K يملك الترجمات المحددة بالتركيب λ_a∘λ_b، ρ_b∘ρ_a. تفرد العنصر في K ينتج من weak reductivity. هذا استنتاج مباشر من نظرية معروفة، لا ندعي أصالته. لا نعطي ramification function نفسها، لأنها تعطي النواتج المخفية.

## 2. التصنيف الدقيق للامتدادات المسماة الأساسية
ثبت K وجدوله، وخارج القسمة المسمى، وكل الأفعال على K كما في T49. كل حاصل خارج K يحدد بالخارج، وكل حاصل بعامل في K معلوم. يبقى فقط AB وBA. 
- لأي b∈B وa,a'∈A، (ba)a'=z سواء ba=t أم z، وb(aa')=ba'، لأن A right-zero. إذن BA=z ضرورة.
- AB يمكنه أخذ t أو z. الوحدة g ذات الصورة 1 في C2 تعطي بالربط (a_(i,u)g)b_(j,v)=a_(i,u)(gb_(j,v))، أي w(i,u+1,j,v)=w(i,u,j,v+1). لذا w ثابت على كل فئة u+v mod 2، وليس بالضرورة ثابتاً في كامل الكتلة.
- بالعكس، اختر أي بتين W_(ij,0),W_(ij,1) لكل (i,j)، واجعل a_(i,u)b_(j,v)=t إذا W_(ij,u+v mod2)=1 وإلا z. سائر الجدول ثابت. الثلاثيات من غير الوحدات: AAB وABB تختاران نفس الزوج الفعلي، لا مجرد المؤشرين i,j؛ الأنواع الأخرى كما برهان T49. مع وحدة، المعادلة الوسطى تحفظ الزوجية، والمعادلتان الخارجيتان تحفظان الناتج لأن تأثير الوحدة يسار A ويمين B تافه، ولأنها تثبت t,z. الأفعال تتبادل. إذن كل اختيار يعطي عملية تجميعية ومحايداً.
بذلك عدد العمليات المسماة المتوافقة مع المعطيات الثلاث **بالضبط 2^(2pq)**. لا ادعاء أنها جميعاً غير متماثلة؛ العد مسمى. البناء القديم هو العائلة الجزئية التي تحقق W_(ij,0)=W_(ij,1).
نفس المثاليات لأن at=t وtb=t ثابتان وBA=z. E={t} iff جميع البتات صفرية؛ رتبة التوليد كما سبق. الاستعلام المتغير يقرأ بتاً واحداً؛ لكل بت خانتان. الحد الحتمي الدقيق 2pq، والعشوائي المتوقع الأمثل (1−2ε)2pq لعائلة T49 الجديدة، ببرهان اقتران OR القديم.

## 3. امتداد T56 ومعلومات جانبية أقوى
في كل مكون I_W×C_s استعمل بناء الزوجية أعلاه دون تغيير الإحداثي الدوري (يبقى جمعياً)، ثم طبق الإسقاطات من زمرة الوحدات والمجموع المتعامد كما في المخطوطة. هذا لا يدعي تصنيف كل الامتدادات بعد الضرب الدوري، بل عائلة صريحة منها. الوعد أن مجموعة المصفوفات الصفرية تماماً Z_+ أو Z_-، والبتات 2pq في كل مكون. 
كل الكتل الإلزامية للتوليد باقية: كل A_i أو B_j مع إحداثياته يحتاج ممثلاً؛ وتحتاج طبقة t ممثلاً iff كل بتات المكون صفرية. لو وُجد أي بت واحد، تتوفر كل عوامل AB من الممثلين والوحدات، فينتج t ثم كل إحداثياته. لا يتغير عد h أو g ولا برهان الموازنة ولا حجم n. E تظهر فقط عند مكونات s=1 الصفرية. 
زد البيانات المجانية:
1. المثالي المسمى K = {ω} ∪ ⨆_i ({t_i,z_i}×C_{s_i})، مع جدوله.
2. خارج قسمة Rees N/K كاملاً، مع تحديد الإسقاط وأسماء العناصر خارج K.
3. كل الضربات ax,xa، a∈N وx∈K. داخل K، t_i,c وz_i,c لهما نفس الترجمات؛ لا يميز بينهما أثرهما على K. كل المنتجات المتغيرة A×B تقع في K؛ لذا الخارج والأفعال ثابتة.
4. جدول الضرب الداخلي لكل مثالي رئيسي يساري أو يميني أو ثنائي **حقيقي** (لا يساوي N). لا يتغير، لأن كل مثالي رئيسي حقيقي محتوى في مكون واحد مع ω، ولا يحوي A وB معاً في ذلك المكون. نفس مجموعات المثاليات من البرهان السابق. وبالتالي يمكن أيضاً منح جميع الضربات بين عناصر فئات J القابلة للمقارنة: إذا كانت الفئة الأعلى غير وحدوية احتوى المثالي الثنائي الرئيسي للأعلى العاملين؛ وإن كانت وحدوية فأفعال الوحدات معلومة.
لا نزعم ثبات الضرب الداخلي في **كل** مثالي حقيقي غير رئيسي؛ مثالي غير الوحدات مثلاً قد يحوي A وB. بنية شبكة كل المثاليات كمجموعات ثابتة لأن كل مثالي اتحاد مثاليات رئيسية، لكن الضرب فيها ليس ثابتاً بالضرورة.

نتيجة: لنفس n,r,h,g_r..g_(r+L)، ومع البيانات الإضافية، يبقى التعقيد الحتمي الدقيق m=2pq والعشوائي المتوقع الأمثل (1−2ε)(3m+1)/4=(1−2ε)(6pq+1)/4، بتطبيق برهان v0.5 مباشرة على عدد البتات الجديد. كل بت يحدد 2s² خانة، ولا استعلام يكشف أكثر من بت. المسح التام لمكون واحد يكفي؛ والخصم والتوزيع يستمران. عند p=q=k الحجم n=4Dk+2D+4*2^d+1، والحد الحتمي 2k². لا ادعاء أفضل ثابت ممكن على جميع المونويدات.
هذه تقوية فعلية: مضاعفة عدد البتات دون زيادة الحجم، وتقوية مجموعة المعطيات. لا أسبقية مثبتة، ولا ترقيم جديد قبل مراجعة main.

## 4. تحقق مستقل قابل للإعادة
[JavaScript](../experiments/t56-parity-extension-audit.js)، نفذ مباشرة أثناء الجولة. فحص كل ثلاثيات التجميعية، المحايد، E بالشواهد الثنائية، المثاليات المسماة، idempotents، الانتظام، أفعال الوحدات، كل جدول داخلي لمثالي رئيسي حقيقي، جدول K وأفعاله وخارج القسمة. تحقق انغلاق مكمل الكتل الإلزامية وتوليد شهادة ممثلين، لا حصر لجميع مجموعات التوليد. 
| p×q | T49 كل مصفوفات الزوجية | T54 زوجية مع s=(1,2,2,4) |
|---|---:|---:|
|1×1|4|18|
|1×2|16|32|
|2×1|16|32|
|2×2|256|128|
|المجموع|292|210|
502 جدولاً، PASS. في T54 استنفدنا كل الحالات عند 1×1، وفي باقي الأبعاد كل مواضع البت الوحيد في كل مصفوفة نشطة، للنمطين. الرتب 12،16،16،20 كما في السابق. لم نعد تشغيل CI أو GAP. ليس هذا اختباراً لجميع قيم L، ولا يغني عن البرهان العام.

## 5. قرار الأسبقية والتحرير
المخطوطة v0.6 تحفظ النتائج الأصلية وتضيف التقوية في قسم مستقل، مع توضيح موضعها في نظرية الامتدادات الكلاسيكية. لا تزال الأولوية T56، والآن يمكن صياغة ادعاء أكثر تحديداً باستخدام بيانات امتداد كاملة باستثناء دالة التشعب. بحث مستقبلي: تتبع Clifford–Preston §4.4 وYoshida، تصنيف الامتدادات غير weakly reductive، البحث المتخصص عن ramification وgeneration enumerators؛ لا يتيسر نفي السوابق غير المفهرسة. لا تحكيم خارجي ولا إرسال.
