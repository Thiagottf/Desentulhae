# Desentulhaê

Desentulhaê é uma plataforma web inspirada no OLX para a publicação e busca de anúncios de entulho. A aplicação permite que usuários se cadastrem, façam login, publiquem anúncios com fotos, localização (via GPS e geocodificação reversa), preço e outras informações. Os usuários também podem visualizar detalhes dos anúncios, iniciar um chat com o anunciante, salvar anúncios para visualização futura e gerenciar seus anúncios em um painel.

## Funcionalidades

- **Autenticação:**  
  Cadastro e Login de usuários com dados persistidos no `localStorage`.

- **Publicação de Anúncios:**  
  - Publicação de anúncios com título, descrição, localização (capturada via GPS e convertida em endereço legível com geocodificação reversa através da API Nominatim), contato, categoria e preço.
  - Upload obrigatório de, no mínimo, 4 imagens (convertidas para base64).
  - Exibição de um mapa (via Google Maps Embed API) com um pin na localização do anúncio.

- **Detalhes do Anúncio:**  
  Página de detalhes com:
  - Galeria de imagens exibida em grid.
  - Descrição completa e informações como localização, contato, categoria, data de postagem e preço.
  - Botões para salvar o anúncio, iniciar chat com o anunciante e comprar (simulação que gera notificação).

- **Chat e Notificações:**  
  Sistema de chat entre interessados e anunciantes, com notificações simuladas via `localStorage`.

- **Painel do Usuário:**  
  Área para gerenciar os anúncios publicados, com opções de edição e exclusão.

- **Busca e Filtros:**  
  Navegação e filtragem dos anúncios por localização, categoria, data e palavra-chave.

- **Responsividade:**  
  Interface adaptada para dispositivos móveis com uma Mobile Navbar personalizada e layout responsivo.

## Como Funciona

A aplicação é desenvolvida com **React** e estilizada com **Tailwind CSS**. Para persistir dados durante o desenvolvimento, utiliza-se o `localStorage`.  
O mapa é exibido utilizando o **Google Maps Embed API** (é necessário configurar uma chave de API) e a localização é capturada via a API de geolocalização do navegador, complementada com geocodificação reversa através do **Nominatim API** (OpenStreetMap).

## Instalação

1. **Clone o repositório:**

   ```bash
   git clone https://github.com/seu-usuario/desentulhae.git
   cd desentulhae
react==18.2.0
react-dom==18.2.0
react-router-dom==6.8.1
react-icons==4.7.1
tailwindcss==3.2.4
postcss==8.4.21
autoprefixer==10.4.13
