import re

with open('index.html', 'r', encoding='utf-8') as f:
    content = f.read()

nav_regex = re.compile(r'\s*<!-- Bottom Nav -->\s*<nav class=\"bottom-nav\">\s*(?:<div class=\"nav-item.*?</div>\s*)*</nav>', re.DOTALL)
content = nav_regex.sub('', content)

single_nav = '''
  <!-- ==================== BOTTOM NAVIGATION ==================== -->
  <nav class="bottom-nav" id="main-nav">
    <div class="nav-item active" data-screen="home-screen">
      <i class="fas fa-home nav-icon"></i>
      <span>Home</span>
    </div>
    <div class="nav-item" data-screen="sell-screen">
      <i class="fas fa-tag nav-icon"></i>
      <span>Sell</span>
    </div>
    <div class="nav-item sell-btn" data-screen="sell-screen">
      <div class="nav-icon-circle">
        <i class="fas fa-plus"></i>
      </div>
    </div>
    <div class="nav-item" data-screen="chat-screen">
      <i class="fas fa-comment-dots nav-icon"></i>
      <span>Chat</span>
    </div>
    <div class="nav-item" data-screen="wishlist-screen">
      <i class="fas fa-heart nav-icon"></i>
      <span>Wishlist</span>
    </div>
    <div class="nav-item" data-screen="profile-screen">
      <i class="fas fa-user nav-icon"></i>
      <span>Profile</span>
    </div>
  </nav>
'''

content = content.replace('</div><!-- end app-container -->', single_nav + '</div><!-- end app-container -->')

# 4. Add has-nav class to scroll-content where missing
content = content.replace(
    '<div class="screen" id="product-screen">\n    <div class="product-hero">',
    '__TEMP_PRODUCT__'
)

content = re.sub(
    r'(<div class="screen" id="product-screen">[\s\S]*?)<div class="scroll-content">',
    r'\1<div class="scroll-content has-nav">',
    content
)

content = re.sub(
    r'(<div class="screen" id="admin-screen">[\s\S]*?)<div class="scroll-content">',
    r'\1<div class="scroll-content has-nav">',
    content
)

content = content.replace('__TEMP_PRODUCT__', '<div class="screen" id="product-screen">\n    <div class="product-hero">')

with open('index.html', 'w', encoding='utf-8') as f:
    f.write(content)
