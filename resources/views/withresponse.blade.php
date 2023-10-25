@extends('layout.master')

@section('title')
    {{ $response["data"]["title"]  }}
@endsection

@section('script')
    <script>
        window.response = {!! json_encode($response)  !!};
    </script>
@endsection

@if(isset($response["data"]["viewport"]) && $response["data"]["viewport"] == "desktop") 
    @section('metaViewport')
        <meta name='viewport' content='width=769, initial-scale=1'>
    @endsection
@endif