import re

with open('src/utils/presets.ts', 'r', encoding='utf-8') as f:
    content = f.read()

# Add descriptionTh to interface
content = content.replace("description: string;", "description: string;\n    descriptionTh?: string;")

descriptions = {
    'blank': {
        'en': 'Start from scratch with an empty canvas.',
        'th': 'โหลดหน้าต่างเปล่าที่ไม่มีอะไรเลย เหมาะสำหรับเริ่มลากและวางจำลองระบบตั้งแต่ศูนย์'
    },
    'simple-api': {
        'en': 'Basic Web to API to DB flow. A simple 3-tier architecture demonstrating normal request propagation.',
        'th': 'โครงสร้างระบบ 3 ระดับแบบมาตรฐาน (Web -> API -> DB) แสดงการไหลเวียนของข้อมูลเบื้องต้นบนสภาพปกติ'
    },
    'ecommerce-spike': {
        'en': 'High burst traffic resolving via CDN and Caches. Simulates Black Friday traffic spikes where CDN and Caches absorb most of the load before hitting the backend.',
        'th': 'สถานการณ์คนแห่ใช้แอปช่วงโปรโมชั่น (Black Friday) โหลดจะพุ่งกระฉูดรุนแรง โดยมี CDN และ Cache คอยเป็นโล่รับแรงกระแทก ช่วยให้ Database หลักรอดตาย'
    },
    'healthy-microservices': {
        'en': 'Standard multi-service architecture running smoothly with steady traffic and healthy internal latency.',
        'th': 'ระบบ Microservice แบบมาตรฐานที่มีหลาย Service เชื่อมต่อกัน โดยจำลองโหลดแบบปกติ การทำงานราบรื่น ค่าความหน่วง (Latency) อยู่ในเกณฑ์ดีเยี่ยม'
    },
    'ddos-attack': {
        'en': 'Massive traffic spike overwhelming rate limits and resources. Simulates a botnet attack crippling the WAF and overloading backend servers.',
        'th': 'สถานการณ์จำลองถูกยิงถล่มด้วย DDoS จากเครือข่าย Botnet ทำให้ด่านหน้าที่ทำ Rate Limit (WAF) รับมือไม่ไหว ส่งผลให้โหลดทะลุไปถึงเซิร์ฟเวอร์หลังบ้านจนพังพินาศ'
    },
    'db-bottleneck': {
        'en': 'Frontend is fine, but database locks up causing massive queues. Simulates a slow SQL query bottleneck that eventually crashes the API servers.',
        'th': 'หน้าบ้านและเซิร์ฟเวอร์ทำงานปกติ แต่ไปคอขวดที่โซน Database (เช่น Query ทำงานช้าหรือเกิด Deadlock) ทำให้ฝั่ง Service โดนดองคิวจนพุ่งทะลุขีดจำกัด'
    },
    'cdn-failure': {
        'en': 'CDN is completely missing cache, flooding the backend WAF and Services. Simulates incorrect edge caching configurations leading to total global traffic hitting origin directly.',
        'th': 'จำลองสถานการณ์ฝันร้าย: เมื่อตั้งค่า CDN ผิดพลาดจนเกิด Cache Miss 100% ทำให้ผู้ใช้งานจากทั่วโลกยิงตรงเข้ามาขยี้ระบบหลังบ้านพร้อมๆ กัน'
    },
    'retry-storm': {
        'en': 'Backend is slightly unstable, but Gateway retries aggressively, multiplying load. Simulates the devastating effect of poorly configured auto-retries making a small problem exponentially worse.',
        'th': 'ระบบหลังบ้านร่วงไปแค่นิดเดียว แต่ด่านหน้า (Gateway) ดันขยันสั่ง Retry คำขอซ้ำติดๆ กัน กลายเป็นการปั๊มโหลดตัวเองให้พังหนักขึ้นไปอีก (ปัญหาทุบดินยอดฮิต)'
    },
    'queue-backlog': {
        'en': 'Producers are fast, but consumers are extremely slow causing infinite queue pooling. Simulates an unbalanced async system where events stack up indefinitely.',
        'th': 'ระบบมีปัญหาคนป้อนงานเร็วกว่าคนเคลียร์งาน หน้าบ้านส่งคำขอเข้าคิวเยอะมาก แต่ตัว Worker (Consumer) ฝั่งหลังบ้านทำงานช้า ทำให้คิวค้างเติ่งแตะหลักแสนและพังไปในที่สุด'
    },
    'gateway-rate-limit': {
        'en': 'Strict API Gateway blocks most traffic, saving the backend but annoying users. Highlights how aggressive rate limiting operates under high concurrency.',
        'th': 'เซ็ตค่า Gateway ให้ปฏิเสธคำขอที่เข้ามาเกินโควตาแบบเด็ดขาด (Reject) ผลลัพธ์คือหลังบ้านสบายๆ แต่ผู้ใช้งานจะเจอ Error จำนวนมาก (เป็นบทเรียน Trade-off)'
    },
    'memory-leak': {
        'en': 'The service is severely under-provisioned and gets overwhelmed immediately. Simulates a legacy application with extremely poor performance failing under minimal load.',
        'th': 'จำลองระบบเก่าแก่หรือโดนลดสเปคเครื่อง (Under-provisioned) แค่คนเข้าใช้นิดเดียวเครื่องก็กระตุก คิวเพิ่มรวดเร็ว และพังอย่างง่ายดาย'
    },
    'multi-region-ha': {
        'en': 'Traffic perfectly distributed across US and EU datacenters safely resolving into a global database cluster.',
        'th': 'สุดยอดการออกแบบระบบที่แข็งแกร่ง (HA) แบ่งทราฟฟิกแยกโซนอเมริกา (US) กับ ยุโรป (EU) วิ่งเข้าหลังบ้านของตัวเอง ทำให้ทำงานรวดเร็วและปลอดภัยระดับองค์กรใหญ่'
    },
    'cache-stampede': {
        'en': 'Cache completely fails, routing all traffic simultaneously to a weak Database (Thundering Herd problem).',
        'th': 'ปัญหา Cache แตก (Thundering Herd) เกิดเมื่อ Cache ล่มหรือข้อมูลที่คนใช้เยอะหมดอายุพร้อมกัน ทำให้ทุกคำขอพุ่งทะลุทะลวงไปกระแทก Database ตรงๆ พร้อมกัน'
    },
    'perfect-caching': {
        'en': '99% Cache Hit Rate completely shields the Database from heavy loads, simulating a perfectly tuned in-memory layer.',
        'th': 'โมเดลในอุดมคติที่ระบบ Cache มีประสิทธิภาพระดับเทพ (Hit Rate 99%) สกัดกั้นภาระทั้งหมดไว้ ทำให้ Database หลักแทบไม่ต้องเหนื่อยเลย'
    },
    'microservice-chain': {
        'en': 'Long chain of interconnected services multiplying total latency as each hop introduces delays.',
        'th': 'ปัญหาคลาสสิกของ Microservice คือร้อยกันเป็นโซ่ยาวเกินไป (เกิด Network Hop) ทำให้แม้แต่ละชั้นจะเร็ว แต่รวมกันแล้วหน่วงหนักมาก (Latency สะสม)'
    },
    'asynchronous-email': {
        'en': 'Fast API response while heavy tasks are offloaded to queue consumers, demonstrating a healthy decoupling pattern.',
        'th': 'ตัวอย่างการออกแบบชั้นดีด้วย Asynchronous หน้าบ้านตอบสนองผู้ใช้ปุ๊บปั๊บ ส่วนงานหนักๆ (เช่น ส่งอีเมล ถอดรหัส) โยนลงคิวให้หลังบ้านค่อยๆ ทยอยเคลียร์ตามความสามารถ'
    },
    'massive-global-success': {
        'en': 'Massive architecture using every element, configured perfectly to handle heavy steady global load efficiently.',
        'th': 'โครงสร้างระดับองค์กรใหญ่ไซส์บึ้ม (ใช้โหนดครบทุกประเภท) ตั้งค่าระบบอย่างดีเยี่ยม ทำให้รองรับการหลั่งไหลของทราฟฟิกมหาศาลได้อย่างนุ่มนวล'
    },
    'massive-global-collapse': {
        'en': 'Massive architecture cascading into total failure across all components due to a deadly combination of bypassed CDN, overwhelmed WAF, and slow databases.',
        'th': 'โครงสร้างระดับองค์กรใหญ่ไซส์บึ้ม แต่ล้มเหลวแบบคอมโบต่อเนื่อง (Domino Effect) ตั้งแต่หน้าบ้านยันหลังบ้าน ตายเกลื่อนทุกเซิร์ฟเวอร์จนกราฟพังยับเยิน'
    }
}

for pid, desc in descriptions.items():
    # We need to find the specific preset definition and replace the description
    # Pattern to match: id: 'pid', ... description: 'old desc',
    
    # Let's find description line near id: '{pid}'
    pattern = rf"(id:\s*'{pid}',[^}}]+?description:\s*)'[^']+'"
    replacement = rf"\1'{desc['en']}',\n        descriptionTh: '{desc['th']}'"
    content = re.sub(pattern, replacement, content, count=1)

with open('src/utils/presets.ts', 'w', encoding='utf-8') as f:
    f.write(content)
