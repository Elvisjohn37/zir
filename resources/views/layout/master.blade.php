@inject('frontend', 'App\Http\Services\FrontendService')
@inject('language', 'App\Http\Services\LanguageService')
@inject('mobileSiteService', 'App\Http\Services\MobileSiteService')
@section('metaViewport')
    @if($mobileSiteService->isMobileSite())  
        <meta name='viewport' content='width=350, initial-scale=1'>
    @else
        <meta name='viewport' content='width=768, initial-scale=1'>
    @endif
@endsection

<!DOCTYPE html>
<html lang="{{$language->getCurrent()}}">
    <head>
        {{-- Metas --}}
        <meta charset='utf-8'>
        <meta http-equiv='X-UA-Compatible' content='IE=edge'>
        @yield('metaViewport')
        <meta name="theme-color" content="#b0b0b0" />
        <meta name="msapplication-navbutton-color" content="#b0b0b0">
        <meta name="apple-mobile-web-app-capable" content="yes">
        <meta name='mobile-web-app-capable' content='yes'>
        <meta name="apple-mobile-web-app-status-bar-style" content="black">
        <meta name="csrf-token" content="{{ csrf_token() }}">
        <title>@yield('title', 'Welcome to SBOBET Casino')</title>
    
        <script>
            window.assetURL = "{{$frontend->getAssetUrl()}}";
        </script>
        
        @yield('script')
        
        @if($mobileSiteService->hasMobileElements())  
            @foreach ($mobileSiteService->getAssetEntryPoints('css') as $css)
                <link rel="stylesheet" type="text/css" href="{{$css}}">
            @endforeach
        @endif

        @foreach ($frontend->getAssetEntryPoints('css') as $css)
            <link rel="stylesheet" type="text/css" href="{{$frontend->getAssetUrl().$css}}">
        @endforeach
    </head>
    <body  class="{{ $mobileSiteService->hasMobileElements() ? 'zip-mobile-el' : 'zip-full' }}">
        @yield('bodyBefore')
        <div id='root'></div>
        @yield('bodyAfter')

        {{-- SBO Mobile Component element --}}
        @if($mobileSiteService->hasMobileElements())
            <div id="pp-component" loginFrom="Casino" isAsi="true" style="display:none"></div> 
        @endif
        
        {{-- SBO Mobile JS --}}
        @if($mobileSiteService->hasMobileElements())  
            <script src="{{$frontend->getAssetUrl().'/sbo/eventEmitter.js'}}" type="text/javascript"></script>
            <script>
                window.eventEmitter = new EventEmitter(); 
            </script>

            @foreach ($mobileSiteService->getAssetEntryPoints('js') as $js)
	            <script src="{{$js}}" type="text/javascript"></script>
            @endforeach
        @endif

        @foreach ($frontend->getAssetEntryPoints('js') as $js)
	        <script src="{{$frontend->getAssetUrl().$js}}" type="text/javascript"></script>
        @endforeach
    </body>
</html>